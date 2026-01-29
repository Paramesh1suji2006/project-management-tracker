import express from 'express';
import {
    getSprints,
    getSprint,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    getSprintVelocity,
    getBurndownData,
} from '../controllers/sprintController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Sprint CRUD
router.get('/', getSprints);
router.post('/', createSprint);
router.get('/:id', getSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

// Sprint lifecycle
router.post('/:id/start', startSprint);
router.post('/:id/complete', completeSprint);

// Sprint analytics
router.get('/:id/velocity', getSprintVelocity);
router.get('/:id/burndown', getBurndownData);

export default router;
