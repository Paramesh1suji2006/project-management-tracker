import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a label name'],
            trim: true,
        },
        color: {
            type: String,
            required: [true, 'Please provide a label color'],
            default: '#3b82f6', // blue-500
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        description: {
            type: String,
            trim: true,
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

// Prevent duplicate label names within a project
labelSchema.index({ name: 1, projectId: 1 }, { unique: true });

const Label = mongoose.model('Label', labelSchema);

export default Label;
