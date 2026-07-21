const { verifySessionToken } = require('./auth');

module.exports = async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const decoded = verifySessionToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired session.' });
    return;
  }

  res.status(200).json({ success: true, user: { username: decoded.sub } });
};
