const assert = require('assert');
const { predictIntent, chatbotReply } = require('../chatbot-utils.js');

const cases = [
  { query: 'repair my laptop screen', expectedIntent: 'repair_inquiry' },
  { query: 'do you teach web design', expectedIntent: 'training_inquiry' },
  { query: 'how much is the course', expectedIntent: 'fees_payment' },
  { query: 'where are you located', expectedIntent: 'location' },
  { query: 'do you offer industrial training', expectedIntent: 'industrial_training' },
  { query: 'can a beginner join', expectedIntent: 'beginner_friendly' }
];

for (const testCase of cases) {
  const match = predictIntent(testCase.query);
  assert.ok(match, `Expected a match for: ${testCase.query}`);
  assert.strictEqual(match.intent, testCase.expectedIntent, `Expected ${testCase.expectedIntent} for "${testCase.query}" but got ${match.intent}`);
}

const fallback = chatbotReply('something totally unexpected and unrelated');
assert.ok(typeof fallback === 'string' && fallback.length > 0, 'Fallback response should be a non-empty string');

console.log('Chatbot tests passed.');
