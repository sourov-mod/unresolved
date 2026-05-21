import { sha256 } from './utils';

/**
 * Send OTP via MSG91.
 * Returns session data to store in DB.
 */
export async function sendOTP(phone: string): Promise<{
  otp_code: string;
  phone_hash: string;
  phone_last4: string;
}> {
  // Generate 6-digit OTP
  const otp_code = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash phone immediately — plain number must NEVER be persisted
  const phone_hash = await sha256(phone);
  const phone_last4 = phone.slice(-4);

  // Send via MSG91
  try {
    await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: process.env.MSG91_API_KEY!,
      },
      body: JSON.stringify({
        mobile: `91${phone}`,
        otp: otp_code,
        sender: process.env.MSG91_SENDER_ID || 'UNRSLV',
        otp_length: 6,
        otp_expiry: 10, // minutes
      }),
    });
  } catch (error) {
    console.error('MSG91 OTP send failed:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }

  return { otp_code, phone_hash, phone_last4 };
}

/**
 * Validate Indian phone number format.
 * Must be 10 digits starting with 6-9.
 */
export function validateIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}
