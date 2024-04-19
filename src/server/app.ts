import express from 'express';

import 'express-async-errors';

import router from './routes';

import { NotFoundError } from '@/errors';
import { errorHandler, metricsHandler } from '@/middleware';

const app = express();

// Metrics
app.use(metricsHandler);

// Middlewares
app.use(express.json());

// Routes
app.use(router);

app.all('*', (req, res) => {
    throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

export default app;
