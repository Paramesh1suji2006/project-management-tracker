import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a sprint name'],
            trim: true,
        },
        goal: {
            type: String,
            trim: true,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['planning', 'active', 'completed'],
            default: 'planning',
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
    },
    {
        timestamps: true,
    }
);

// Virtual for sprint duration in days
sprintSchema.virtual('durationDays').get(function () {
    if (this.startDate && this.endDate) {
        const diff = this.endDate - this.startDate;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Ensure virtuals are included in JSON
sprintSchema.set('toJSON', { virtuals: true });
sprintSchema.set('toObject', { virtuals: true });

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
