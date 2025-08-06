import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL!, 
  apiKey: process.env.QDRANT_API_KEY!, 
});


export const COLLECTION_NAME = "pdf_documents";

export const initializeQdrantCollection = async () => {
  try {
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 768,
          distance: "Cosine",
        },
      });
    }
  } catch (error) {
    console.error("Error initializing Qdrant collection:", error);
    throw error;
  }
};