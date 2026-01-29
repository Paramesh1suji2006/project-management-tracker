import express from 'express';
import {
    getReleases,
    getRelease,
    createRelease,
    updateRelease,
    deleteRelease,
    getReleaseNotes,
} from '../controllers/releaseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getReleases);
router.post('/', createRelease);
router.get('/:id', getRelease);
router.put('/:id', updateRelease);
router.delete('/:id', deleteRelease);
router.get('/:id/notes', getReleaseNotes);

export default router;
