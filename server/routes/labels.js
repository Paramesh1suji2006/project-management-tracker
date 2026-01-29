import express from 'express';
import {
    getLabels,
    createLabel,
    updateLabel,
    deleteLabel,
    addLabelToTicket,
    removeLabelFromTicket,
} from '../controllers/labelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getLabels);
router.post('/', createLabel);
router.put('/:id', updateLabel);
router.delete('/:id', deleteLabel);
router.post('/add-to-ticket', addLabelToTicket);
router.post('/remove-from-ticket', removeLabelFromTicket);

export default router;
