import mongoose from 'mongoose';

const releaseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a release name'],
            trim: true,
        },
        version: {
            type: String,
            trim: true,
        },
        releaseDate: {
            type: Date,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['planned', 'in-progress', 'released'],
            default: 'planned',
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

const Release = mongoose.model('Release', releaseSchema);

export default Release;
