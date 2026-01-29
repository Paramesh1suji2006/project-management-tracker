import express from 'express';
import {
    logTime,
    getTimeLogs,
    updateTimeLog,
    deleteTimeLog,
    getTimeReport,
} from '../controllers/timeLogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', logTime);
router.get('/', getTimeLogs);
router.get('/report', getTimeReport);
router.put('/:id', updateTimeLog);
router.delete('/:id', deleteTimeLog);

export default router;
