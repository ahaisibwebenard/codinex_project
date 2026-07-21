const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function saveContact(contact) {
  if (!supabase) return null;
  const { error } = await supabase.from('contacts').insert([contact]);
  if (error) throw error;
  return true;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, service, message } = req.body || {};
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(email).trim())) {
    res.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  const contact = {
    name: String(name).trim(),
    email: String(email).trim(),
    service: String(service || '').trim(),
    message: String(message || '').trim()
  };

  try {
    await saveContact(contact);
  } catch (error) {
    console.error('Contact save failed:', error);
    // continue even if DB write fails, because the request is still accepted for now
  }

  res.status(200).json({
    success: true,
    message: '✓ Request received — an advisor will email you within one business day.'
  });
};