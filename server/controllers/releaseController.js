import Release from '../models/Release.js';
import Ticket from '../models/Ticket.js';

// Get all releases for a project
export const getReleases = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const releases = await Release.find({ projectId })
            .populate('createdBy', 'username email')
            .sort({ releaseDate: -1 });

        res.json(releases);
    } catch (error) {
        console.error('Get releases error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single release
export const getRelease = async (req, res) => {
    try {
        const release = await Release.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!release) {
            return res.status(404).json({ message: 'Release not found' });
        }

        res.json(release);
    } catch (error) {
        console.error('Get release error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create release
export const createRelease = async (req, res) => {
    try {
        const { name, version, releaseDate, description, projectId, status } = req.body;

        if (!name || !projectId) {
            return res.status(400).json({ message: 'Name and Project ID are required' });
        }

        const release = await Release.create({
            name,
            version,
            releaseDate,
            description,
            projectId,
            status,
            createdBy: req.user._id,
        });

        const populatedRelease = await Release.findById(release._id)
            .populate('createdBy', 'username email');

        res.status(201).json(populatedRelease);
    } catch (error) {
        console.error('Create release error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update release
export const updateRelease = async (req, res) => {
    try {
        const { name, version, releaseDate, description, status } = req.body;

        const release = await Release.findById(req.params.id);

        if (!release) {
            return res.status(404).json({ message: 'Release not found' });
        }

        if (name) release.name = name;
        if (version !== undefined) release.version = version;
        if (releaseDate) release.releaseDate = releaseDate;
        if (description !== undefined) release.description = description;
        if (status) release.status = status;

        await release.save();

        res.json(release);
    } catch (error) {
        console.error('Update release error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete release
export const deleteRelease = async (req, res) => {
    try {
        const release = await Release.findById(req.params.id);

        if (!release) {
            return res.status(404).json({ message: 'Release not found' });
        }

        // Remove release reference from all tickets
        await Ticket.updateMany(
            { releaseId: release._id },
            { $unset: { releaseId: '' } }
        );

        await Release.findByIdAndDelete(req.params.id);

        res.json({ message: 'Release deleted successfully' });
    } catch (error) {
        console.error('Delete release error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get release notes
export const getReleaseNotes = async (req, res) => {
    try {
        const release = await Release.findById(req.params.id);

        if (!release) {
            return res.status(404).json({ message: 'Release not found' });
        }

        // Get all tickets in this release
        const tickets = await Ticket.find({ releaseId: release._id })
            .populate('assignee', 'username')
            .populate('createdBy', 'username')
            .sort({ type: 1, priority: -1 });

        // Group by type
        const groupedTickets = {
            Epic: tickets.filter((t) => t.type === 'Epic'),
            Story: tickets.filter((t) => t.type === 'Story'),
            Task: tickets.filter((t) => t.type === 'Task'),
            Bug: tickets.filter((t) => t.type === 'Bug'),
            Subtask: tickets.filter((t) => t.type === 'Subtask'),
        };

        // Calculate progress
        const totalTickets = tickets.length;
        const completedTickets = tickets.filter((t) => t.status === 'Done').length;
        const completionRate = totalTickets > 0 ? (completedTickets / totalTickets * 100).toFixed(2) : 0;

        res.json({
            release,
            tickets: groupedTickets,
            totalTickets,
            completedTickets,
            completionRate,
        });
    } catch (error) {
        console.error('Get release notes error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
