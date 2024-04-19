export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_VERSION: string;

            PORT: number;
            MONGO_URI: string;

            JAEGER_URI: string;
            JAEGER_SERVICE_NAME: string;
        }
    }
}
