const crypto = require('crypto');

function getAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME || 'benard',
    password: process.env.ADMIN_PASSWORD || 'trent',
    sessionSecret: process.env.ADMIN_SESSION_SECRET || 'dev-session-secret'
  };
}

function verifyAdminCredentials(username, password) {
  const { username: expectedUsername, password: expectedPassword } = getAdminConfig();
  return String(username || '').trim() === expectedUsername && String(password || '') === expectedPassword;
}

function createSessionToken(subject) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: subject, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 })).toString('base64url');
  const data = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', getAdminConfig().sessionSecret).update(data).toString('hex');
  return `${data}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expectedSignature = crypto.createHmac('sha256', getAdminConfig().sessionSecret).update(data).toString('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { verifyAdminCredentials, createSessionToken, verifySessionToken, getAdminConfig };
