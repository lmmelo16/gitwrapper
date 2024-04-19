import mongoose from 'mongoose';

interface ICommit {
    commitHash: string;
    message: string;

    project: mongoose.Types.ObjectId;

    author: string;
    date: string;
}

interface CommitDocument extends ICommit, mongoose.Document {}

interface CommitModel extends mongoose.Model<CommitDocument> {
    build(attr: ICommit): CommitDocument;
}

const CommitSchema = new mongoose.Schema({
    commitHash: {
        type: String,
        required: true,
        unique: true,
    },
    message: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

CommitSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

CommitSchema.statics.build = (attr: ICommit) => {
    return new Commit(attr);
};

// Index commit hash
CommitSchema.index({ project: 1 });

export const Commit = mongoose.model<CommitDocument, CommitModel>(
    'Commit',
    CommitSchema
);
