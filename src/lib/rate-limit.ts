import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Lazy-init Redis client (only created when first rate limit check runs)
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || url.includes('placeholder')) {
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

/**
 * Pre-configured rate limiters for different endpoints.
 * Uses sliding window algorithm for smooth rate limiting.
 */
const limiters = new Map<string, Ratelimit>();

function getLimiter(
  name: string,
  maxRequests: number,
  windowSeconds: number
): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  const key = `${name}:${maxRequests}:${windowSeconds}`;
  if (limiters.has(key)) return limiters.get(key)!;

  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: `unresolved:rl:${name}`,
    analytics: false,
  });

  limiters.set(key, limiter);
  return limiter;
}

/**
 * Extract a stable identifier from the request for rate limiting.
 * Uses x-forwarded-for (common on Vercel/proxies), then falls back to
 * a generic key if no IP is available.
 */
function getIdentifier(request: NextRequest, suffix?: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return suffix ? `${ip}:${suffix}` : ip;
}

export type RateLimitResult = {
  limited: boolean;
  response?: NextResponse;
};

/**
 * Check rate limit for a request.
 *
 * Fail-open: if Redis is not configured or unavailable, the request is allowed
 * through. This prevents a Redis outage from taking down the whole app.
 *
 * @param request   - The incoming NextRequest
 * @param name      - Limiter name (used as Redis key prefix)
 * @param max       - Maximum requests allowed in the window
 * @param windowSec - Window duration in seconds
 * @param keySuffix - Optional suffix to append to the IP-based key
 *                    (e.g. phone_hash for per-phone limiting)
 */
export async function checkRateLimit(
  request: NextRequest,
  name: string,
  max: number,
  windowSec: number,
  keySuffix?: string
): Promise<RateLimitResult> {
  try {
    const limiter = getLimiter(name, max, windowSec);

    // Fail-open if Redis is not configured
    if (!limiter) {
      return { limited: false };
    }

    const identifier = getIdentifier(request, keySuffix);
    const result = await limiter.limit(identifier);

    if (!result.success) {
      const retryAfterMs = result.reset - Date.now();
      const retryAfterSec = Math.ceil(Math.max(retryAfterMs, 1000) / 1000);

      return {
        limited: true,
        response: NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retry_after: retryAfterSec,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(retryAfterSec),
              'X-RateLimit-Limit': String(result.limit),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.reset),
            },
          }
        ),
      };
    }

    return { limited: false };
  } catch (error) {
    // Fail-open: if Redis is down, allow the request through
    console.error(`Rate limit check failed for ${name}:`, error);
    return { limited: false };
  }
}

// ──────────────────────────────────────────────────
// Convenience wrappers for each endpoint
// ──────────────────────────────────────────────────

/** OTP send: 5 requests per IP per 15 minutes */
export function checkOTPSendLimit(request: NextRequest, phoneHash?: string) {
  return checkRateLimit(request, 'otp-send', 5, 900, phoneHash);
}

/** OTP verify: 10 attempts per IP per 15 minutes */
export function checkOTPVerifyLimit(request: NextRequest) {
  return checkRateLimit(request, 'otp-verify', 10, 900);
}

/** Complaint submission: 3 per IP per hour */
export function checkSubmitLimit(request: NextRequest) {
  return checkRateLimit(request, 'complaint-submit', 3, 3600);
}

/** Upvote: 30 per IP per hour */
export function checkUpvoteLimit(request: NextRequest) {
  return checkRateLimit(request, 'upvote', 30, 3600);
}

/** Upload presign: 15 per IP per 15 minutes */
export function checkUploadLimit(request: NextRequest) {
  return checkRateLimit(request, 'upload', 15, 900);
}

/** Search: 30 per IP per minute */
export function checkSearchLimit(request: NextRequest) {
  return checkRateLimit(request, 'search', 30, 60);
}

/** Social comment: 5 per IP per hour */
export function checkCommentLimit(request: NextRequest) {
  return checkRateLimit(request, 'comment', 5, 3600);
}

/** Social me-too vote: 20 per IP per hour */
export function checkMeTooLimit(request: NextRequest) {
  return checkRateLimit(request, 'metoo', 20, 3600);
}
