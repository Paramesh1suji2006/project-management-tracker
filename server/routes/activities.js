import express from 'express';
import {
    getActivities,
    getActivityFeed,
    createActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getActivities);
router.get('/feed', getActivityFeed);
router.post('/', createActivity);

export default router;
