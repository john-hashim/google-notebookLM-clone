import { Request, Response } from "express";
import multer from "multer";
import { generateEmbeddings, processPdfToChunks } from "./services/pdfProcessor";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadMiddleware = upload.single("pdf");

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const fileName = req.body.fileName;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No PDF file uploaded' 
      });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only PDF files are allowed' 
      });
    }

    const chunks = await processPdfToChunks(file.buffer);

    const embeddings = await generateEmbeddings(chunks);
    
    console.log(`Created ${embeddings.length} embeddings`);

    return res.json({
      success: true,
      message: 'PDF processed successfully',
      data: {
        fileName: fileName || file.originalname,
        size: file.size,
        chunksCount: chunks.length
        // documentId: documentId // Will add this later
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process PDF' 
    });
  }
};

// export const clearDocument = async (req: Request, res: Response) => {
//   try {
//     console.log("Clearing document from memory/vector storage");

//     res.json({
//       success: true,
//       message: "Document cleared successfully",
//     });
//   } catch (error) {
//     console.error("Clear document error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to clear document",
//     });
//   }
// };
