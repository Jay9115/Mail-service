// utils/rateLimiter.js
// Simple in-memory store for request counts per email (for demo).
// For production use Redis for persistent counters and multiple instances.

const map = new Map();

/**
 * allowed: maxRequests per windowMs
 */
function emailRateCheck(email, maxRequests = 5, windowMs = 30 * 60 * 1000) {
  const now = Date.now();
  const rec = map.get(email) || { count: 0, firstAt: now };

  if (now - rec.firstAt > windowMs) {
    // reset window
    rec.count = 1;
    rec.firstAt = now;
    map.set(email, rec);
    return { ok: true, remaining: maxRequests - 1 };
  }

  if (rec.count >= maxRequests) return { ok: false, retryAfterMs: windowMs - (now - rec.firstAt) };

  rec.count += 1;
  map.set(email, rec);
  return { ok: true, remaining: maxRequests - rec.count };
}

module.exports = { emailRateCheck };
