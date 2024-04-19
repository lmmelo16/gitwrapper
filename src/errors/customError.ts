export interface IError {
    message: string;
    field?: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializer(): IError {
        return { message: this.message };
    }
}
