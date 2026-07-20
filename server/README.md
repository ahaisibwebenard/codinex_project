Codinex Chatbot Server (scaffold)

This server shows a minimal pipeline to build an embedding index from your CSV and answer semantic queries.

Prerequisites:
- Node 18+
- An OpenAI API key in the environment variable `OPENAI_API_KEY` (or replace with another embeddings provider)

Install:

```bash
cd server
npm install
```

Build an index (demo, first 5k rows):

```bash
OPENAI_API_KEY=your_key_here npm start
# then POST /build-index to http://localhost:3000/build-index (use curl or Postman)
```

Query:

POST http://localhost:3000/query with JSON body:
{ "q": "my question here" }

The server returns the top similar rows with scores.

Notes:
- This is a demo scaffold. For production use, persist embeddings in a vector DB (Pinecone, Weaviate, FAISS) and add rate limiting, auth, and retry logic.
