/*
Simple scaffold server to build an embedding index from the CSV and answer queries.
Requires Node.js and an OpenAI API key in OPENAI_API_KEY.
This is a minimal example for demonstration and is NOT production hardened.
*/

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { OpenAIApi, Configuration } = require('openai');
const parse = require('csv-parse/lib/sync');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const client = new OpenAIApi(configuration);

let index = []; // in-memory: [{embedding: [...], row: {instruction,response,intent}}]

app.post('/build-index', async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '..', 'Bitext_Sample_Customer_Support_Training_Dataset_27K_responses-v11.csv');
    const raw = fs.readFileSync(csvPath, 'utf8');
    const records = parse(raw, { columns: true, skip_empty_lines: true });
    index = [];
    for (const r of records.slice(0, 5000)) { // limit for demo
      const text = (r.instruction || '') + '\n' + (r.response || '');
      const emb = await client.createEmbedding({ model: 'text-embedding-3-large', input: text });
      index.push({ embedding: emb.data[0].embedding, row: r });
    }
    res.json({ success: true, count: index.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

app.post('/query', async (req, res) => {
  try {
    const q = req.body.q || '';
    const qEmbResp = await client.createEmbedding({ model: 'text-embedding-3-large', input: q });
    const qEmb = qEmbResp.data[0].embedding;
    const scored = index.map(it => ({ score: cosine(qEmb, it.embedding), row: it.row }));
    scored.sort((a,b)=>b.score-a.score);
    const top = scored.slice(0,5).map(s=>({score:s.score, instruction: s.row.instruction, response: s.row.response, intent: s.row.intent}));
    res.json({ top });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
