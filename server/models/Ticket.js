import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a ticket title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done'],
            default: 'To Do',
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Sprint Management
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sprint',
        },
        // Advanced Ticket Types
        type: {
            type: String,
            enum: ['Epic', 'Story', 'Task', 'Bug', 'Subtask'],
            default: 'Task',
        },
        parentTicket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        },
        epicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        },
        storyPoints: {
            type: Number,
            min: 0,
            default: 0,
        },
        // Time Tracking
        estimatedHours: {
            type: Number,
            min: 0,
        },
        remainingHours: {
            type: Number,
            min: 0,
        },
        // Labels
        labels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Label',
            },
        ],
        // Due Date
        dueDate: {
            type: Date,
        },
        // Watchers
        watchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Release
        releaseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Release',
        },
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
