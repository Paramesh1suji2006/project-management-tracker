import TimeLog from '../models/TimeLog.js';
import Ticket from '../models/Ticket.js';

// Log time on a ticket
export const logTime = async (req, res) => {
    try {
        const { ticketId, hoursLogged, description, activityType, date } = req.body;

        if (!ticketId || !hoursLogged) {
            return res.status(400).json({ message: 'Ticket ID and hours logged are required' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const timeLog = await TimeLog.create({
            user: req.user._id,
            ticketId,
            hoursLogged,
            date: date || Date.now(),
            description,
            activityType,
        });

        const populatedTimeLog = await TimeLog.findById(timeLog._id)
            .populate('user', 'username email');

        res.status(201).json(populatedTimeLog);
    } catch (error) {
        console.error('Log time error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get time logs for a ticket
export const getTimeLogs = async (req, res) => {
    try {
        const { ticketId, userId, startDate, endDate } = req.query;

        const filter = {};
        if (ticketId) filter.ticketId = ticketId;
        if (userId) filter.user = userId;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const timeLogs = await TimeLog.find(filter)
            .populate('user', 'username email')
            .populate('ticketId', 'title type')
            .sort({ date: -1 });

        const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursLogged, 0);

        res.json({ timeLogs, totalHours });
    } catch (error) {
        console.error('Get time logs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update time log
export const updateTimeLog = async (req, res) => {
    try {
        const { hoursLogged, description, activityType, date } = req.body;

        const timeLog = await TimeLog.findById(req.params.id);

        if (!timeLog) {
            return res.status(404).json({ message: 'Time log not found' });
        }

        // Only the user who created the log can update it
        if (timeLog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this time log' });
        }

        if (hoursLogged !== undefined) timeLog.hoursLogged = hoursLogged;
        if (description !== undefined) timeLog.description = description;
        if (activityType) timeLog.activityType = activityType;
        if (date) timeLog.date = date;

        await timeLog.save();

        const updatedTimeLog = await TimeLog.findById(timeLog._id)
            .populate('user', 'username email');

        res.json(updatedTimeLog);
    } catch (error) {
        console.error('Update time log error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete time log
export const deleteTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);

        if (!timeLog) {
            return res.status(404).json({ message: 'Time log not found' });
        }

        // Only the user who created the log can delete it
        if (timeLog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this time log' });
        }

        await TimeLog.findByIdAndDelete(req.params.id);

        res.json({ message: 'Time log deleted successfully' });
    } catch (error) {
        console.error('Delete time log error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get time report
export const getTimeReport = async (req, res) => {
    try {
        const { userId, projectId, startDate, endDate } = req.query;

        const filter = {};
        if (userId) filter.user = userId;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const timeLogs = await TimeLog.find(filter)
            .populate('user', 'username email')
            .populate({
                path: 'ticketId',
                select: 'title type priority status projectId',
                populate: { path: 'projectId', select: 'title' },
            })
            .sort({ date: -1 });

        // Filter by project if specified
        let filteredLogs = timeLogs;
        if (projectId) {
            filteredLogs = timeLogs.filter(
                (log) => log.ticketId?.projectId?._id.toString() === projectId
            );
        }

        // Calculate statistics
        const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);

        const byActivityType = filteredLogs.reduce((acc, log) => {
            acc[log.activityType] = (acc[log.activityType] || 0) + log.hoursLogged;
            return acc;
        }, {});

        const byUser = filteredLogs.reduce((acc, log) => {
            const username = log.user.username;
            acc[username] = (acc[username] || 0) + log.hoursLogged;
            return acc;
        }, {});

        res.json({
            timeLogs: filteredLogs,
            totalHours,
            byActivityType,
            byUser,
        });
    } catch (error) {
        console.error('Get time report error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
