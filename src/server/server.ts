import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import { connectMongoDB } from '@/database';

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectMongoDB();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
