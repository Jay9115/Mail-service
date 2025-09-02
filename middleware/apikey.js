// middleware/apiKey.js
const crypto = require('crypto');

function constantTimeEquals(a, b) {
  // both must be Buffers
  if (!Buffer.isBuffer(a)) a = Buffer.from(String(a));
  if (!Buffer.isBuffer(b)) b = Buffer.from(String(b));

  // if lengths differ, compare against same-length buffer of zeros to avoid short-circuit timing
  if (a.length !== b.length) {
    const zeroBuf = Buffer.alloc(Math.max(a.length, b.length));
    return crypto.timingSafeEqual(Buffer.concat([a, zeroBuf]).slice(0, Math.max(a.length, b.length)),
                                 Buffer.concat([b, zeroBuf]).slice(0, Math.max(a.length, b.length)));
  }
  return crypto.timingSafeEqual(a, b);
}

module.exports = function requireApiKey(req, res, next) {
  const headerKey = req.header('x-api-key') || req.query.api_key || req.get('Authorization'); // accept header or query (optional)
  const configuredKey = process.env.SHARED_API_KEY;
  if (!configuredKey) {
    console.error('SHARED_API_KEY not defined in env');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (!headerKey) return res.status(401).json({ error: 'Missing API key' });

  try {
    // constant-time compare
    if (!constantTimeEquals(headerKey, configuredKey)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    // attach a simple flag / client id if you want
    req.client = { apiKeyVerified: true };
    return next();
  } catch (err) {
    console.error('API key verify error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
