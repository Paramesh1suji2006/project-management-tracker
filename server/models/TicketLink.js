import mongoose from 'mongoose';

const ticketLinkSchema = new mongoose.Schema(
    {
        sourceTicket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        targetTicket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        linkType: {
            type: String,
            enum: ['blocks', 'blocked-by', 'relates-to', 'duplicates', 'duplicate-of'],
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate links
ticketLinkSchema.index({ sourceTicket: 1, targetTicket: 1, linkType: 1 }, { unique: true });

const TicketLink = mongoose.model('TicketLink', ticketLinkSchema);

export default TicketLink;
