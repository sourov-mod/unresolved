import leoProfanity from 'leo-profanity';

// Initialize leo-profanity
leoProfanity.loadDictionary();

// Custom Indian language abusive terms (Hindi/Urdu common slurs)
const INDIAN_BLOCKED_WORDS = [
  'madarchod', 'behenchod', 'bhenchod', 'chutiya', 'chutiye',
  'gaandu', 'gaand', 'harami', 'haramkhor', 'randi',
  'kutte', 'kutta', 'kuttiya', 'saala', 'saali',
  'kamina', 'kameena', 'kameeni', 'bhosdike', 'bhosdiwala',
  'lodu', 'laude', 'lund', 'jhaat', 'tatti',
  'bakchod', 'bakchodi', 'gandu', 'hijra',
  'mc', 'bc', // abbreviations
];

// Aadhaar number pattern (12 digits, often with spaces)
const AADHAAR_PATTERN = /\b\d{4}\s?\d{4}\s?\d{4}\b/;

// Raw phone number pattern (10+ digits)
const PHONE_PATTERN = /\b[6-9]\d{9}\b/;

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

/**
 * Run moderation checks on complaint text.
 * Returns pass/fail with reason.
 */
export function moderateText(text: string): { passed: boolean; reason?: string } {
  const lower = text.toLowerCase();

  // 1. leo-profanity check (English)
  if (leoProfanity.check(lower)) {
    return { passed: false, reason: 'Your text contains inappropriate language. Please revise.' };
  }

  // 2. Indian language profanity check
  for (const word of INDIAN_BLOCKED_WORDS) {
    if (lower.includes(word)) {
      return { passed: false, reason: 'Your text contains inappropriate language. Please revise.' };
    }
  }

  // 3. Check for Aadhaar numbers (personal data)
  if (AADHAAR_PATTERN.test(text)) {
    return { passed: false, reason: 'Please remove any Aadhaar numbers from your complaint for privacy.' };
  }

  // 4. Check for raw phone numbers
  if (PHONE_PATTERN.test(text)) {
    return { passed: false, reason: 'Please remove phone numbers from your complaint text.' };
  }

  // 5. Block URLs
  if (URL_PATTERN.test(text)) {
    return { passed: false, reason: 'URLs are not allowed in complaint text. Describe the issue instead.' };
  }

  return { passed: true };
}

/**
 * Validate filer name.
 */
export function validateName(name: string): { valid: boolean; reason?: string } {
  if (!name || name.trim().length < 2) {
    return { valid: false, reason: 'Name must be at least 2 characters.' };
  }

  if (name.trim().length > 100) {
    return { valid: false, reason: 'Name must be under 100 characters.' };
  }

  // Only letters, spaces, dots, hyphens
  if (!/^[a-zA-Z\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\s.\-']+$/.test(name)) {
    return { valid: false, reason: 'Name can only contain letters, spaces, dots, and hyphens.' };
  }

  // Block test/fake names
  const blocked = ['test', 'user', 'anonymous', 'admin', 'fake', 'xyz', 'asdf', 'name'];
  if (blocked.includes(name.trim().toLowerCase())) {
    return { valid: false, reason: 'Please enter your real name.' };
  }

  // Block digit-only strings
  if (/^\d+$/.test(name.trim())) {
    return { valid: false, reason: 'Name cannot be only numbers.' };
  }

  return { valid: true };
}

/**
 * Moderate all parts of a complaint submission.
 */
export function moderateComplaint(data: {
  title: string;
  description: string;
  filer_name: string;
}): { passed: boolean; errors: string[] } {
  const errors: string[] = [];

  const nameCheck = validateName(data.filer_name);
  if (!nameCheck.valid) errors.push(nameCheck.reason!);

  const titleCheck = moderateText(data.title);
  if (!titleCheck.passed) errors.push(`Title: ${titleCheck.reason}`);

  const descCheck = moderateText(data.description);
  if (!descCheck.passed) errors.push(`Description: ${descCheck.reason}`);

  return { passed: errors.length === 0, errors };
}
