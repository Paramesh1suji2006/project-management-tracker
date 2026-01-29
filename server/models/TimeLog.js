import mongoose from 'mongoose';

const timeLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        hoursLogged: {
            type: Number,
            required: [true, 'Please provide hours logged'],
            min: 0.1,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
        activityType: {
            type: String,
            enum: ['Development', 'Testing', 'Review', 'Documentation', 'Meeting', 'Other'],
            default: 'Development',
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
timeLogSchema.index({ ticketId: 1, user: 1, date: -1 });

const TimeLog = mongoose.model('TimeLog', timeLogSchema);

export default TimeLog;
