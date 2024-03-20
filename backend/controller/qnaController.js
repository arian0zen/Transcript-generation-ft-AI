require("core-js/features/string/replace-all");
require("dotenv").config();
const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAI } = require("@langchain/openai");
const { loadQAStuffChain } = require("langchain/chains");
const e = require("express");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_ENV = "asia-southeast1-gcp";

const qna = async (req, res) => {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    });
    const client = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });

    const index_name = process.env.PINECONE_INDEX_NAME;
    const pineconeIndex = client.Index(index_name);
    const docSearch = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });
    const query = req.body.query || "Why was Donald Trump arrested ?";

    const searchResults = await docSearch.similaritySearch(query, 5);

    const llm = new OpenAI({
      temperature: 0.7,
      openAIApiKey: OPENAI_API_KEY,
    });

    const chain = loadQAStuffChain(llm);
    const responseAns = await chain.call({
      input_documents: searchResults,
      question: query,
    });
    res.json(responseAns);
  } catch (errors) {
    console.log("error", errors);
    res.json({
      error: "well, this is awkward.. I don't know the answer for that",
    });
  }
};

module.exports = qna;
