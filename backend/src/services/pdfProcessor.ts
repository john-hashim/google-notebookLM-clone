import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  return new GoogleGenAI({ apiKey });
};

export const extractTextFromPdf = async (
  pdfBuffer: Buffer
): Promise<String> => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
};

export const splitTextIntoChunks = (
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] => {
  const chunks: string[] = [];

  const cleanText = text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  if (cleanText.length <= chunkSize) {
    return [cleanText];
  }

  let start = 0;

  while (start < cleanText.length) {
    let end = start + chunkSize;
    if (end < cleanText.length) {
      const sentenceEnd = cleanText.lastIndexOf(".", end);
      const questionEnd = cleanText.lastIndexOf("?", end);
      const exclamationEnd = cleanText.lastIndexOf("!", end);

      const lastSentenceEnd = Math.max(
        sentenceEnd,
        questionEnd,
        exclamationEnd
      );
      if (lastSentenceEnd > start + chunkSize - 200) {
        end = lastSentenceEnd + 1;
      } else {
        const lastSpace = cleanText.lastIndexOf(" ", end);
        if (lastSpace > start) {
          end = lastSpace;
        }
      }
    }

    const chunk = cleanText.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start = end - overlap;

    if (start <= 0) {
      start = end;
    }
  }

  return chunks;
};

export const processPdfToChunks = async (
  pdfBuffer: Buffer,
  chunkSize: number = 1000,
  overlap: number = 200
): Promise<string[]> => {
  try {
    const extractedText = (await extractTextFromPdf(pdfBuffer)) as string;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text found in PDF");
    }

    const chunks = splitTextIntoChunks(extractedText, chunkSize, overlap);

    console.log(`PDF processed: ${chunks.length} chunks created`);

    return chunks;
  } catch (error) {
    throw new Error(`Failed to process PDF: ${error}`);
  }
};

export const generateEmbeddings = async (chunks: string[]) => {
  const ai = initializeGemini();
  const embeddings = [];

  for (const chunk of chunks) {
    if (!chunk) continue;

    const response = await ai.models.embedContent({
      model: "embedding-001",
      contents: [chunk],
    });
    if (response && response.embeddings && response.embeddings[0]) {
      embeddings.push({
        text: chunk,
        embedding: response.embeddings[0].values,
      });
    }
  }
  return embeddings;
};
