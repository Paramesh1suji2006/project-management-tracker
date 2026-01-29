import Label from '../models/Label.js';
import Ticket from '../models/Ticket.js';

// Get all labels for a project
export const getLabels = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const labels = await Label.find({ projectId })
            .populate('createdBy', 'username email')
            .sort({ name: 1 });

        res.json(labels);
    } catch (error) {
        console.error('Get labels error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create label
export const createLabel = async (req, res) => {
    try {
        const { name, color, projectId, description } = req.body;

        if (!name || !projectId) {
            return res.status(400).json({ message: 'Name and Project ID are required' });
        }

        const label = await Label.create({
            name,
            color: color || '#3b82f6',
            projectId,
            description,
            createdBy: req.user._id,
        });

        const populatedLabel = await Label.findById(label._id)
            .populate('createdBy', 'username email');

        res.status(201).json(populatedLabel);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Label name already exists in this project' });
        }
        console.error('Create label error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update label
export const updateLabel = async (req, res) => {
    try {
        const { name, color, description } = req.body;

        const label = await Label.findById(req.params.id);

        if (!label) {
            return res.status(404).json({ message: 'Label not found' });
        }

        if (name) label.name = name;
        if (color) label.color = color;
        if (description !== undefined) label.description = description;

        await label.save();

        res.json(label);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Label name already exists in this project' });
        }
        console.error('Update label error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete label
export const deleteLabel = async (req, res) => {
    try {
        const label = await Label.findById(req.params.id);

        if (!label) {
            return res.status(404).json({ message: 'Label not found' });
        }

        // Remove label from all tickets
        await Ticket.updateMany(
            { labels: label._id },
            { $pull: { labels: label._id } }
        );

        await Label.findByIdAndDelete(req.params.id);

        res.json({ message: 'Label deleted successfully' });
    } catch (error) {
        console.error('Delete label error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add label to ticket
export const addLabelToTicket = async (req, res) => {
    try {
        const { ticketId, labelId } = req.body;

        if (!ticketId || !labelId) {
            return res.status(400).json({ message: 'Ticket ID and Label ID are required' });
        }

        const ticket = await Ticket.findById(ticketId);
        const label = await Label.findById(labelId);

        if (!ticket || !label) {
            return res.status(404).json({ message: 'Ticket or Label not found' });
        }

        if (!ticket.labels.includes(labelId)) {
            ticket.labels.push(labelId);
            await ticket.save();
        }

        const updatedTicket = await Ticket.findById(ticketId).populate('labels');

        res.json(updatedTicket);
    } catch (error) {
        console.error('Add label to ticket error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove label from ticket
export const removeLabelFromTicket = async (req, res) => {
    try {
        const { ticketId, labelId } = req.body;

        if (!ticketId || !labelId) {
            return res.status(400).json({ message: 'Ticket ID and Label ID are required' });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.labels = ticket.labels.filter(
            (label) => label.toString() !== labelId
        );
        await ticket.save();

        const updatedTicket = await Ticket.findById(ticketId).populate('labels');

        res.json(updatedTicket);
    } catch (error) {
        console.error('Remove label from ticket error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
