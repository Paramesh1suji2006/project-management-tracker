import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a project title'],
            trim: true,
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
        teamMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Automatically add creator to team members
projectSchema.pre('save', function (next) {
    if (this.isNew && !this.teamMembers.includes(this.createdBy)) {
        this.teamMembers.push(this.createdBy);
    }
    next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
