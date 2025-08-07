import { Request, Response } from "express";
import multer from "multer";
import {
  generateEmbeddings,
  processPdfToChunks,
} from "./services/pdfProcessor";
import { v4 as uuidv4 } from "uuid";
import { COLLECTION_NAME, qdrantClient } from "./services/qdrant";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadMiddleware = upload.single("pdf");

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    const chunks = await processPdfToChunks(file.buffer);
    const embeddings = await generateEmbeddings(chunks);

    const points = embeddings.map((result) => ({
      id: uuidv4(),
      vector: result.embedding as number[],
      payload: {
        content: result.text,
        fileName: file.originalname,
      },
    }));

    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: points,
    });

    return res.json({
      success: true,
      message: "PDF processed and stored successfully",
      chunksCount: chunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process PDF",
    });
  }
};

export const clearDocument = async (res: Response) => {
  try {
    console.log("Clearing document from memory/vector storage");

    await qdrantClient.delete(COLLECTION_NAME, {
      filter: {},
    });

    res.json({
      success: true,
      message: "Document cleared successfully",
    });
  } catch (error) {
    console.error("Clear document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear document",
    });
  }
};