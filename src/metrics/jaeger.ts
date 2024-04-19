//OpenTelemetry
import { Resource } from '@opentelemetry/resources';
import {
    SEMRESATTRS_SERVICE_NAME,
    SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import {
    NodeTracerProvider,
    BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { Span, Tracer, trace } from '@opentelemetry/api';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

import { Request, Response } from 'express';

//Exporter
const Tracer = () => {
    const exporter = new OTLPTraceExporter({
        url: process.env.JAEGER_URI,
    });

    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SEMRESATTRS_SERVICE_NAME]: process.env.JAEGER_SERVICE_NAME,
            [SEMRESATTRS_SERVICE_VERSION]: process.env.APP_VERSION,
        }),
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    provider.register();

    return trace.getTracer(process.env.JAEGER_SERVICE_NAME);
};

export class Jaeger {
    tracer: Tracer;
    span?: Span;

    constructor() {
        this.tracer = Tracer();
    }

    addTag(key: string, value: string) {
        this.span?.setAttribute(key, value);
    }

    endSpan() {
        this.span?.end();
    }

    startSpan(spanName: string) {
        this.span = this.tracer.startSpan(spanName);
    }

    handleReqRes(req: Request, res: Response) {
        req.trace = this;

        res.once('finish', () => {
            this.addTag('http.method', req.method);
            this.addTag('http.url', req.url);
            this.addTag('http.status_code', res.statusCode.toString());

            this.endSpan();
        });
    }
}
