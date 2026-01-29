import Sprint from '../models/Sprint.js';
import Ticket from '../models/Ticket.js';

// Get all sprints for a project
export const getSprints = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const sprints = await Sprint.find({ projectId })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        res.json(sprints);
    } catch (error) {
        console.error('Get sprints error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single sprint
export const getSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        res.json(sprint);
    } catch (error) {
        console.error('Get sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create sprint
export const createSprint = async (req, res) => {
    try {
        const { name, goal, startDate, endDate, projectId } = req.body;

        if (!name || !projectId) {
            return res.status(400).json({ message: 'Name and Project ID are required' });
        }

        const sprint = await Sprint.create({
            name,
            goal,
            startDate,
            endDate,
            projectId,
            createdBy: req.user._id,
        });

        const populatedSprint = await Sprint.findById(sprint._id)
            .populate('createdBy', 'username email');

        res.status(201).json(populatedSprint);
    } catch (error) {
        console.error('Create sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update sprint
export const updateSprint = async (req, res) => {
    try {
        const { name, goal, startDate, endDate, status } = req.body;

        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        // Update fields
        if (name) sprint.name = name;
        if (goal !== undefined) sprint.goal = goal;
        if (startDate) sprint.startDate = startDate;
        if (endDate) sprint.endDate = endDate;
        if (status) sprint.status = status;

        await sprint.save();

        const updatedSprint = await Sprint.findById(sprint._id)
            .populate('createdBy', 'username email');

        res.json(updatedSprint);
    } catch (error) {
        console.error('Update sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete sprint
export const deleteSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        // Check if there are tickets in this sprint
        const ticketsInSprint = await Ticket.countDocuments({ sprintId: sprint._id });

        if (ticketsInSprint > 0) {
            return res.status(400).json({
                message: 'Cannot delete sprint with tickets. Please move or remove tickets first.'
            });
        }

        await Sprint.findByIdAndDelete(req.params.id);

        res.json({ message: 'Sprint deleted successfully' });
    } catch (error) {
        console.error('Delete sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Start sprint
export const startSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        if (sprint.status === 'active') {
            return res.status(400).json({ message: 'Sprint is already active' });
        }

        // Check if there's already an active sprint in this project
        const activeSprint = await Sprint.findOne({
            projectId: sprint.projectId,
            status: 'active'
        });

        if (activeSprint) {
            return res.status(400).json({
                message: 'Another sprint is already active. Please complete it first.'
            });
        }

        sprint.status = 'active';
        if (!sprint.startDate) {
            sprint.startDate = new Date();
        }

        await sprint.save();

        res.json(sprint);
    } catch (error) {
        console.error('Start sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Complete sprint
export const completeSprint = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        if (sprint.status === 'completed') {
            return res.status(400).json({ message: 'Sprint is already completed' });
        }

        sprint.status = 'completed';
        if (!sprint.endDate) {
            sprint.endDate = new Date();
        }

        await sprint.save();

        res.json(sprint);
    } catch (error) {
        console.error('Complete sprint error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get sprint velocity (story points completed)
export const getSprintVelocity = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        // Get all tickets in this sprint
        const tickets = await Ticket.find({ sprintId: sprint._id });

        // Calculate velocity (completed tickets with story points)
        const completedTickets = tickets.filter(t => t.status === 'Done');
        const totalStoryPoints = completedTickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        const totalTickets = tickets.length;
        const completedCount = completedTickets.length;

        res.json({
            totalTickets,
            completedTickets: completedCount,
            remainingTickets: totalTickets - completedCount,
            totalStoryPoints,
            completionRate: totalTickets > 0 ? (completedCount / totalTickets * 100).toFixed(2) : 0,
        });
    } catch (error) {
        console.error('Get sprint velocity error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get burndown data
export const getBurndownData = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        if (!sprint) {
            return res.status(404).json({ message: 'Sprint not found' });
        }

        if (!sprint.startDate || !sprint.endDate) {
            return res.status(400).json({ message: 'Sprint must have start and end dates' });
        }

        // Get all tickets in this sprint
        const tickets = await Ticket.find({ sprintId: sprint._id });
        const totalStoryPoints = tickets.reduce((sum, t) => sum + (t.storyPoints || 1), 0);

        // Calculate ideal burndown
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const today = new Date();
        const currentDate = today > endDate ? endDate : today;

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysPassed = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));

        // Ideal burndown (linear)
        const idealBurndown = [];
        for (let i = 0; i <= totalDays; i++) {
            idealBurndown.push({
                day: i,
                remaining: totalStoryPoints - (totalStoryPoints / totalDays) * i,
            });
        }

        // Actual burndown based on completed tickets
        const completedStoryPoints = tickets
            .filter(t => t.status === 'Done')
            .reduce((sum, t) => sum + (t.storyPoints || 1), 0);

        const actualRemaining = totalStoryPoints - completedStoryPoints;

        res.json({
            totalStoryPoints,
            completedStoryPoints,
            remainingStoryPoints: actualRemaining,
            totalDays,
            daysPassed,
            idealBurndown,
            actualRemaining,
            onTrack: actualRemaining <= idealBurndown[daysPassed]?.remaining,
        });
    } catch (error) {
        console.error('Get burndown data error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
