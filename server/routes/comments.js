import express from 'express';
import {
    createComment,
    getComments,
    deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getComments).post(protect, createComment);

router.route('/:id').delete(protect, deleteComment);

export default router;
