import TicketLink from '../models/TicketLink.js';
import Ticket from '../models/Ticket.js';

// Get all links for a ticket
export const getTicketLinks = async (req, res) => {
    try {
        const { ticketId } = req.query;

        if (!ticketId) {
            return res.status(400).json({ message: 'Ticket ID is required' });
        }

        // Get links where ticket is either source or target
        const links = await TicketLink.find({
            $or: [{ sourceTicket: ticketId }, { targetTicket: ticketId }],
        })
            .populate('sourceTicket', 'title status type priority')
            .populate('targetTicket', 'title status type priority')
            .populate('createdBy', 'username email');

        res.json(links);
    } catch (error) {
        console.error('Get ticket links error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a link between tickets
export const createTicketLink = async (req, res) => {
    try {
        const { sourceTicket, targetTicket, linkType } = req.body;

        if (!sourceTicket || !targetTicket || !linkType) {
            return res.status(400).json({
                message: 'Source ticket, target ticket, and link type are required'
            });
        }

        // Verify both tickets exist
        const source = await Ticket.findById(sourceTicket);
        const target = await Ticket.findById(targetTicket);

        if (!source || !target) {
            return res.status(404).json({ message: 'One or both tickets not found' });
        }

        // Prevent self-linking
        if (sourceTicket === targetTicket) {
            return res.status(400).json({ message: 'Cannot link a ticket to itself' });
        }

        // Check for existing link
        const existingLink = await TicketLink.findOne({
            sourceTicket,
            targetTicket,
            linkType,
        });

        if (existingLink) {
            return res.status(400).json({ message: 'This link already exists' });
        }

        // Create the link
        const link = await TicketLink.create({
            sourceTicket,
            targetTicket,
            linkType,
            createdBy: req.user._id,
        });

        const populatedLink = await TicketLink.findById(link._id)
            .populate('sourceTicket', 'title status type priority')
            .populate('targetTicket', 'title status type priority')
            .populate('createdBy', 'username email');

        res.status(201).json(populatedLink);
    } catch (error) {
        console.error('Create ticket link error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a ticket link
export const deleteTicketLink = async (req, res) => {
    try {
        const link = await TicketLink.findById(req.params.id);

        if (!link) {
            return res.status(404).json({ message: 'Link not found' });
        }

        await TicketLink.findByIdAndDelete(req.params.id);

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Delete ticket link error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get dependency graph for a ticket (all related tickets)
export const getTicketDependencies = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Get all links for this ticket
        const links = await TicketLink.find({
            $or: [{ sourceTicket: ticketId }, { targetTicket: ticketId }],
        })
            .populate('sourceTicket', 'title status type priority')
            .populate('targetTicket', 'title status type priority');

        // Organize by relationship type
        const dependencies = {
            blocks: [],
            blockedBy: [],
            relatesTo: [],
            duplicates: [],
            duplicateOf: [],
        };

        links.forEach((link) => {
            const isSource = link.sourceTicket._id.toString() === ticketId;
            const relatedTicket = isSource ? link.targetTicket : link.sourceTicket;

            switch (link.linkType) {
                case 'blocks':
                    if (isSource) {
                        dependencies.blocks.push(relatedTicket);
                    } else {
                        dependencies.blockedBy.push(relatedTicket);
                    }
                    break;
                case 'blocked-by':
                    if (isSource) {
                        dependencies.blockedBy.push(relatedTicket);
                    } else {
                        dependencies.blocks.push(relatedTicket);
                    }
                    break;
                case 'relates-to':
                    dependencies.relatesTo.push(relatedTicket);
                    break;
                case 'duplicates':
                    if (isSource) {
                        dependencies.duplicates.push(relatedTicket);
                    } else {
                        dependencies.duplicateOf.push(relatedTicket);
                    }
                    break;
                case 'duplicate-of':
                    if (isSource) {
                        dependencies.duplicateOf.push(relatedTicket);
                    } else {
                        dependencies.duplicates.push(relatedTicket);
                    }
                    break;
            }
        });

        res.json(dependencies);
    } catch (error) {
        console.error('Get ticket dependencies error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
