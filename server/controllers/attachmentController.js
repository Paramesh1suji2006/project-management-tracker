import Attachment from '../models/Attachment.js';
import Ticket from '../models/Ticket.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload attachment
export const uploadAttachment = async (req, res) => {
    try {
        const { ticketId } = req.body;

        if (!ticketId) {
            return res.status(400).json({ message: 'Ticket ID is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const attachment = await Attachment.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            ticketId,
            uploadedBy: req.user._id,
        });

        const populatedAttachment = await Attachment.findById(attachment._id)
            .populate('uploadedBy', 'username email');

        res.status(201).json(populatedAttachment);
    } catch (error) {
        console.error('Upload attachment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get attachments for a ticket
export const getAttachments = async (req, res) => {
    try {
        const { ticketId } = req.query;

        if (!ticketId) {
            return res.status(400).json({ message: 'Ticket ID is required' });
        }

        const attachments = await Attachment.find({ ticketId })
            .populate('uploadedBy', 'username email')
            .sort({ createdAt: -1 });

        res.json(attachments);
    } catch (error) {
        console.error('Get attachments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Download attachment
export const downloadAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        const filePath = path.resolve(attachment.path);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('Download attachment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete attachment
export const deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // Check if user is the uploader or admin
        if (attachment.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete this attachment' });
        }

        // Delete file from filesystem
        const filePath = path.resolve(attachment.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Attachment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Attachment deleted successfully' });
    } catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
