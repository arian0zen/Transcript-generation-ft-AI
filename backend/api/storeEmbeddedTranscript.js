require("dotenv").config();
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_ENV = "asia-southeast1-gcp";
const storeEmbedded = async (textFile) => {
  try {
    const loader = new TextLoader(textFile);
    const documents = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunk_size: 1000,
      chunk_overlap: 10,
    });
    const texts = await textSplitter.splitDocuments(documents);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    });
    const client = new PineconeClient();
    await client.init({
      environment: PINECONE_API_ENV,
      apiKey: PINECONE_API_KEY,
    });
    const index_name = process.env.PINECONE_INDEX_NAME;
    const pineconeIndex = client.Index(index_name);
    await PineconeStore.fromDocuments(texts, embeddings, {
      pineconeIndex,
    });
    return "success";
  } catch (error) {
    return "error";
  }
};

module.exports = storeEmbedded;
