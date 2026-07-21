const assert = require('assert');
const { verifyAdminCredentials, createSessionToken, verifySessionToken } = require('../api/admin/auth');

process.env.ADMIN_USERNAME = 'benard';
process.env.ADMIN_PASSWORD = 'trent';
process.env.ADMIN_SESSION_SECRET = 'test-secret';

assert.strictEqual(verifyAdminCredentials('benard', 'trent'), true, 'Correct admin credentials should verify');
assert.strictEqual(verifyAdminCredentials('benard', 'wrong-password'), false, 'Incorrect admin credentials should fail');

const token = createSessionToken('benard');
assert.ok(token, 'Session token should be created');
assert.deepStrictEqual(verifySessionToken(token), { sub: 'benard', exp: verifySessionToken(token).exp }, 'Session token should round-trip');

console.log('Admin auth tests passed.');
