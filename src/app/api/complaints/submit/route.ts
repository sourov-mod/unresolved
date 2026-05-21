import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateUniqueToken } from '@/lib/token-generator';
import { moderateComplaint } from '@/lib/moderation';
import { checkForSpam } from '@/lib/spam-detection';
import { calculateScore, getLabel, recalculateCompanyStats } from '@/lib/ranking';
import { slugify } from '@/lib/utils';
import { COMPLAINT_CATEGORIES } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      otp_session_id,
      filer_name,
      filer_email,
      company_name,
      category,
      title,
      description,
      proof_urls,
      language = 'en',
    } = body;

    const supabase = createServerClient();

    // 1. Verify OTP session
    const { data: session } = await supabase
      .from('otp_sessions')
      .select('*')
      .eq('id', otp_session_id)
      .eq('verified', true)
      .single();

    if (!session) {
      return NextResponse.json(
        { error: 'Phone verification required. Please verify your phone number first.' },
        { status: 401 }
      );
    }

    // 2. Validate required fields
    const errors: string[] = [];

    if (!filer_name || filer_name.trim().length < 2 || filer_name.trim().length > 100) {
      errors.push('Name must be 2-100 characters.');
    }
    if (!filer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filer_email)) {
      errors.push('A valid email address is required.');
    }
    if (!company_name || company_name.trim().length < 2 || company_name.trim().length > 200) {
      errors.push('Company name must be 2-200 characters.');
    }
    if (!category || !COMPLAINT_CATEGORIES.includes(category)) {
      errors.push('Invalid category.');
    }
    if (!title || title.trim().length < 10 || title.trim().length > 200) {
      errors.push('Title must be 10-200 characters.');
    }
    if (!description || description.trim().length < 50 || description.trim().length > 5000) {
      errors.push('Description must be 50-5000 characters.');
    }
    if (!proof_urls || !Array.isArray(proof_urls) || proof_urls.length < 1) {
      errors.push('At least one proof file is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    // 3. Moderation check
    const modResult = moderateComplaint({ title, description, filer_name });
    if (!modResult.passed) {
      return NextResponse.json(
        { error: modResult.errors.join(' ') },
        { status: 422 }
      );
    }

    // 4. Spam detection
    const spamResult = await checkForSpam({ title, description, company_name }, session.phone_hash);
    if (spamResult.is_spam) {
      return NextResponse.json(
        { error: 'Your submission was flagged. Please ensure your complaint is unique and detailed.' },
        { status: 422 }
      );
    }

    // 5. Generate token
    const token = await generateUniqueToken();
    const company_slug = slugify(company_name);

    // 6. Upsert company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id, total_complaints, resolved_count, response_rate')
      .eq('slug', company_slug)
      .single();

    let company_id: string;

    if (existingCompany) {
      company_id = existingCompany.id;
      const newTotal = existingCompany.total_complaints + 1;
      const newScore = calculateScore({
        total_complaints: newTotal,
        resolved_count: existingCompany.resolved_count,
        response_rate: existingCompany.response_rate,
      });

      await supabase
        .from('companies')
        .update({
          total_complaints: newTotal,
          score: newScore,
          rank_label: getLabel(newScore),
          updated_at: new Date().toISOString(),
        })
        .eq('id', company_id);
    } else {
      const newScore = calculateScore({ total_complaints: 1, resolved_count: 0, response_rate: 0 });
      const { data: newCompany } = await supabase
        .from('companies')
        .insert({
          name: company_name.trim(),
          slug: company_slug,
          category,
          total_complaints: 1,
          score: newScore,
          rank_label: getLabel(newScore),
        })
        .select('id')
        .single();

      company_id = newCompany!.id;
    }

    // 7. Insert complaint
    const { data: complaint, error: insertError } = await supabase
      .from('complaints')
      .insert({
        token,
        company_id,
        company_name: company_name.trim(),
        company_slug,
        category,
        title: title.trim(),
        description: description.trim(),
        filer_name: filer_name.trim(),
        filer_email: filer_email.trim(),
        phone_hash: session.phone_hash,
        phone_last4: session.phone_last4 || '****', // Use actual phone digits from OTP session
        status: 'registered',
        upvotes: 0,
        is_verified: true,
        is_flagged: false,
        is_published: true,
        proof_urls,
        language,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    // 8. Insert timeline entry
    await supabase.from('complaint_timeline').insert({
      complaint_id: complaint!.id,
      token,
      status: 'registered',
      message: 'Complaint filed and publicly visible.',
      updated_by: 'system',
    });

    // 9. Recalculate company stats from actual complaint data
    await recalculateCompanyStats(supabase, company_id);

    return NextResponse.json({
      token,
      complaint_id: complaint!.id,
      message: 'Complaint filed successfully.',
    });
  } catch (error: unknown) {
    console.error('Complaint submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit complaint. Please try again.' },
      { status: 500 }
    );
  }
}
