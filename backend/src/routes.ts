import express from 'express';
import { uploadPdf, uploadMiddleware } from './controller';

const router = express.Router();

router.post('/upload-pdf', uploadMiddleware, uploadPdf);

export default router;