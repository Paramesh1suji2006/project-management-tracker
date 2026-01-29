import express from 'express';
import {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getTickets).post(protect, createTicket);

router
    .route('/:id')
    .get(protect, getTicket)
    .put(protect, updateTicket)
    .delete(protect, deleteTicket);

router.route('/:id/status').put(protect, updateTicketStatus);

export default router;
