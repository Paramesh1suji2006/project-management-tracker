import express from 'express';
import {
    getTicketLinks,
    createTicketLink,
    deleteTicketLink,
    getTicketDependencies,
} from '../controllers/ticketLinkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getTicketLinks);
router.post('/', createTicketLink);
router.delete('/:id', deleteTicketLink);
router.get('/dependencies/:ticketId', getTicketDependencies);

export default router;
