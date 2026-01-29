import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true, // e.g., 'created', 'updated', 'deleted', 'commented'
        },
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        changes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed, // { field: { old: value, new: value } }
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
activitySchema.index({ ticketId: 1, createdAt: -1 });
activitySchema.index({ projectId: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
