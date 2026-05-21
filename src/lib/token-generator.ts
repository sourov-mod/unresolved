import { createServerClient } from './supabase/server';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusable chars (no I,O,0,1)

function randomChars(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

/**
 * Generate a unique complaint token: UNR-YYYY-XXXXXX
 * Checks DB for collisions and retries if needed.
 */
export async function generateUniqueToken(): Promise<string> {
  const supabase = createServerClient();
  const year = new Date().getFullYear();
  let attempts = 0;

  while (attempts < 10) {
    const token = `UNR-${year}-${randomChars(6)}`;

    const { data } = await supabase
      .from('complaints')
      .select('id')
      .eq('token', token)
      .single();

    if (!data) return token; // No collision
    attempts++;
  }

  // Fallback: use timestamp for uniqueness
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  return `UNR-${year}-${ts}`;
}
