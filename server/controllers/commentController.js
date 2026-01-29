import Comment from '../models/Comment.js';
import Ticket from '../models/Ticket.js';

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
    try {
        const { ticketId, text } = req.body;

        // Verify ticket exists
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const comment = await Comment.create({
            ticketId,
            userId: req.user._id,
            text,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            'userId',
            'name email role'
        );

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a ticket
// @route   GET /api/comments?ticketId=
// @access  Private
export const getComments = async (req, res) => {
    try {
        const { ticketId } = req.query;

        if (!ticketId) {
            return res.status(400).json({ message: 'Ticket ID is required' });
        }

        const comments = await Comment.find({ ticketId })
            .populate('userId', 'name email role')
            .sort('createdAt');

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Admin, Creator)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check authorization
        const isCreator = comment.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'Admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
