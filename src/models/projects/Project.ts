import mongoose from 'mongoose';

import { Commit } from '@/models';

interface IProject {
    gitRepo: string;
    name: string;
    path: string;
}

interface ProjectDocument extends IProject, mongoose.Document {
    commits: mongoose.ObjectId[];
    lastCommitPull: Date;

    delete(): Promise<void>;
    getTimeSinceLastPull(): number;
}

interface ProjectModel extends mongoose.Model<ProjectDocument> {
    build(attr: IProject): ProjectDocument;
}

const ProjectSchema = new mongoose.Schema({
    gitRepo: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    commits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Commit',
        },
    ],
    lastCommitPull: {
        type: Date,
        default: 0, // initial value is 0 to force a pull on first request
    },
});

ProjectSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

ProjectSchema.statics.build = (attr: IProject) => {
    return new Project(attr);
};

// Custom delete method to remove all commits associated with the project
ProjectSchema.methods.delete = async function () {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const commits = this.get('commits');

        await Promise.all(
            commits.map(async (commitId: mongoose.Types.ObjectId) => {
                await Commit.findByIdAndDelete(commitId);
            })
        );

        await this.deleteOne();

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

// Custom method to get the time since the last pull in minutes
ProjectSchema.methods.getTimeSinceLastPull = function () {
    const now = new Date();
    const lastPull = this.get('lastCommitPull');

    return (now.getTime() - lastPull.getTime()) / 1000 / 60;
};

export const Project = mongoose.model<ProjectDocument, ProjectModel>(
    'Project',
    ProjectSchema
);
