const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptIndex = pc.Index('cohort-chat-gpt');

async function createMemory(vector, metadata, messageId) {
    await chatgptIndex.upsert([{
        values: vector,
        metadata: metadata,
        id: messageId
    }])
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await chatgptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata && Object.keys(metadata).length ? metadata : undefined,
        includeMetadata: true,
    })
    return data.matches
}

module.exports = {
    createMemory,
    queryMemory
}