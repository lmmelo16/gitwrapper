import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    constructor() {
        super('Error connecting to database');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}
