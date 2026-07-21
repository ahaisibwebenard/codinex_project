const { verifyAdminCredentials, createSessionToken } = require('./auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  if (!verifyAdminCredentials(username, password)) {
    res.status(401).json({ error: 'Invalid admin credentials.' });
    return;
  }

  const token = createSessionToken(username);
  res.status(200).json({
    success: true,
    token,
    message: 'Admin login successful.'
  });
};
