import Ticket from '../models/Ticket.js';
import Project from '../models/Project.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
    try {
        const { title, description, priority, projectId, assignee } = req.body;

        // Verify project exists and user has access
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.teamMembers.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isMember && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to create tickets in this project' });
        }

        const ticket = await Ticket.create({
            title,
            description,
            priority,
            projectId,
            assignee,
            createdBy: req.user._id,
        });

        const populatedTicket = await Ticket.findById(ticket._id)
            .populate('assignee', 'name email role')
            .populate('createdBy', 'name email role')
            .populate('projectId', 'title');

        res.status(201).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tickets with filters
// @route   GET /api/tickets?projectId=&status=&priority=&assignee=&search=
// @access  Private
export const getTickets = async (req, res) => {
    try {
        const { projectId, status, priority, assignee, search } = req.query;

        let query = {};

        if (projectId) {
            query.projectId = projectId;
        }

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (assignee) {
            query.assignee = assignee;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const tickets = await Ticket.find(query)
            .populate('assignee', 'name email role')
            .populate('createdBy', 'name email role')
            .populate('projectId', 'title')
            .sort('-createdAt');

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('assignee', 'name email role')
            .populate('createdBy', 'name email role')
            .populate('projectId', 'title');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
export const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const { title, description, priority, status, assignee } = req.body;

        ticket.title = title || ticket.title;
        ticket.description = description !== undefined ? description : ticket.description;
        ticket.priority = priority || ticket.priority;
        ticket.status = status || ticket.status;
        ticket.assignee = assignee !== undefined ? assignee : ticket.assignee;

        const updatedTicket = await ticket.save();
        const populatedTicket = await Ticket.findById(updatedTicket._id)
            .populate('assignee', 'name email role')
            .populate('createdBy', 'name email role')
            .populate('projectId', 'title');

        res.json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin, Manager, Creator)
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check authorization
        const isCreator = ticket.createdBy.toString() === req.user._id.toString();
        const isAuthorized = ['Admin', 'Manager'].includes(req.user.role) || isCreator;

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to delete this ticket' });
        }

        await ticket.deleteOne();
        res.json({ message: 'Ticket removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket status (for drag & drop)
// @route   PUT /api/tickets/:id/status
// @access  Private
export const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = status;
        const updatedTicket = await ticket.save();

        const populatedTicket = await Ticket.findById(updatedTicket._id)
            .populate('assignee', 'name email role')
            .populate('createdBy', 'name email role')
            .populate('projectId', 'title');

        res.json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
