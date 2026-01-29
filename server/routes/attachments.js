import express from 'express';
import {
    uploadAttachment,
    getAttachments,
    downloadAttachment,
    deleteAttachment,
} from '../controllers/attachmentController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', upload.single('file'), uploadAttachment);
router.get('/', getAttachments);
router.get('/:id/download', downloadAttachment);
router.delete('/:id', deleteAttachment);

export default router;
