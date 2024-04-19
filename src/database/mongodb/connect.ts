import mongoose from 'mongoose';

import { DatabaseConnectionError } from '@/errors';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (e) {
        console.log(e);
        throw new DatabaseConnectionError();
    }
};
