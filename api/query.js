const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { Configuration, OpenAIApi } = require('openai');

const CSV_PATH = path.join(process.cwd(), 'Bitext_Sample_Customer_Support_Training_Dataset_27K_responses-v11.csv');
let knowledgeRows = null;

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return new Set(normalize(text).split(' ').filter(Boolean));
}

function loadKnowledge() {
  if (knowledgeRows) return knowledgeRows;
  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(raw, { columns: true, skip_empty_lines: true });
  knowledgeRows = rows.map((row) => ({
    instruction: row.instruction || '',
    response: row.response || '',
    intent: row.intent || '',
    tokens: tokenize((row.instruction || '') + ' ' + (row.response || ''))
  }));
  return knowledgeRows;
}

function scoreQuery(queryTokens, rowTokens) {
  let common = 0;
  for (const token of queryTokens) {
    if (rowTokens.has(token)) common += 1;
  }
  const unionSize = new Set([...queryTokens, ...rowTokens]).size;
  return unionSize > 0 ? common / unionSize : 0;
}

function findBestRows(query, topN = 5) {
  const rows = loadKnowledge();
  const queryTokens = tokenize(query);
  const scored = rows.map((row) => ({
    row,
    score: scoreQuery(queryTokens, row.tokens)
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored
    .slice(0, topN)
    .filter((item) => item.score > 0)
    .map((item) => item.row);
}

function buildPrompt(query, rows) {
  if (!rows.length) {
    return `Answer the question clearly and concisely for Codinex Computers Ltd in Mbarara, Uganda. Question: ${query}`;
  }

  const examples = rows
    .map((row, index) => {
      return `Example ${index + 1}:
Instruction: ${row.instruction}
Response: ${row.response}`;
    })
    .join('\n\n');

  return `You are an assistant for Codinex Computers Ltd in Mbarara, Uganda.
Use the examples below as guidance when responding to customer questions.
${examples}

Question: ${query}
Answer:`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { q } = req.body || {};
  if (!q || typeof q !== 'string' || !q.trim()) {
    res.status(400).json({ error: 'Missing query text' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is required' });
    return;
  }

  const bestRows = findBestRows(q, 3);
  const prompt = buildPrompt(q, bestRows);

  try {
    const configuration = new Configuration({ apiKey });
    const client = new OpenAIApi(configuration);
    const completion = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful support assistant for Codinex Computers Ltd in Mbarara, Uganda.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    });

    const answer = completion.data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ answer: answer || 'Sorry, I could not generate an answer.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
};
