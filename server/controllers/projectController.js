import Project from '../models/Project.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin, Manager)
export const createProject = async (req, res) => {
    try {
        const { title, description, teamMembers } = req.body;

        const project = await Project.create({
            title,
            description,
            createdBy: req.user._id,
            teamMembers: teamMembers || [],
        });

        const populatedProject = await Project.findById(project._id)
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role');

        res.status(201).json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            teamMembers: req.user._id,
        })
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role')
            .sort('-createdAt');

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is a team member
        const isMember = project.teamMembers.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if (!isMember && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to access this project' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Manager)
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check authorization
        if (
            project.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'Admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const { title, description, teamMembers } = req.body;

        project.title = title || project.title;
        project.description = description !== undefined ? description : project.description;
        project.teamMembers = teamMembers || project.teamMembers;

        const updatedProject = await project.save();
        const populatedProject = await Project.findById(updatedProject._id)
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add team member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin, Manager)
export const addTeamMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a member
        if (project.teamMembers.includes(userId)) {
            return res.status(400).json({ message: 'User is already a team member' });
        }

        project.teamMembers.push(userId);
        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin, Manager)
export const removeTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Cannot remove creator
        if (project.createdBy.toString() === req.params.userId) {
            return res.status(400).json({ message: 'Cannot remove project creator' });
        }

        project.teamMembers = project.teamMembers.filter(
            (member) => member.toString() !== req.params.userId
        );

        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('createdBy', 'name email role')
            .populate('teamMembers', 'name email role');

        res.json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
