import express from 'express';
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router
    .route('/')
    .get(protect, getProjects)
    .post(protect, authorize('Admin', 'Manager'), createProject);

router
    .route('/:id')
    .get(protect, getProject)
    .put(protect, authorize('Admin', 'Manager'), updateProject)
    .delete(protect, authorize('Admin'), deleteProject);

router
    .route('/:id/members')
    .post(protect, authorize('Admin', 'Manager'), addTeamMember);

router
    .route('/:id/members/:userId')
    .delete(protect, authorize('Admin', 'Manager'), removeTeamMember);

export default router;
