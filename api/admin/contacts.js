const { createClient } = require('@supabase/supabase-js');
const { verifySessionToken } = require('./auth');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const decoded = verifySessionToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  if (!supabase) {
    res.status(200).json({ success: true, contacts: [], message: 'Supabase is not configured yet.' });
    return;
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: 'Unable to load contacts.' });
    return;
  }

  res.status(200).json({ success: true, contacts: data || [] });
};
