import Activity from '../models/Activity.js';

// Get activities
export const getActivities = async (req, res) => {
    try {
        const { ticketId, projectId, userId, limit = 50 } = req.query;

        const filter = {};
        if (ticketId) filter.ticketId = ticketId;
        if (projectId) filter.projectId = projectId;
        if (userId) filter.user = userId;

        const activities = await Activity.find(filter)
            .populate('user', 'username email')
            .populate('ticketId', 'title')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(activities);
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get activity feed (global feed)
export const getActivityFeed = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const activities = await Activity.find()
            .populate('user', 'username email')
            .populate('ticketId', 'title')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(activities);
    } catch (error) {
        console.error('Get activity feed error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create activity (internal use)
export const createActivity = async (req, res) => {
    try {
        const { user, action, ticketId, projectId, changes, description } = req.body;

        const activity = await Activity.create({
            user,
            action,
            ticketId,
            projectId,
            changes,
            description,
        });

        const populatedActivity = await Activity.findById(activity._id)
            .populate('user', 'username email')
            .populate('ticketId', 'title')
            .populate('projectId', 'title');

        res.status(201).json(populatedActivity);
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
