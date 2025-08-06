import express from 'express';
import { uploadPdf, uploadMiddleware, clearDocument } from './controller';

const router = express.Router();

router.post('/upload-pdf', uploadMiddleware, uploadPdf);
router.post('/clear-document', clearDocument);

export default router;