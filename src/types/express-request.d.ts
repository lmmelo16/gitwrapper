import { JaegerTracer } from '@/metrics';

export {};

declare global {
    namespace Express {
        interface Request {
            trace: JaegerTracer;
        }
    }
}
