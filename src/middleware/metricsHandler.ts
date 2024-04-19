import { Request, Response, NextFunction } from 'express';

import { JaegerTracer } from '@/metrics';

import promClient from 'prom-client';

const collectDefaultMetrics = promClient.collectDefaultMetrics;
const register = new promClient.Registry();

collectDefaultMetrics({ register });

export const metricsHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Jaeger tracer
    const tracer = new JaegerTracer();
    tracer.handleReqRes(req, res);

    // Promethues metrics

    next();
};
