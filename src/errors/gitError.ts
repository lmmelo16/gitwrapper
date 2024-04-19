import { CustomError } from './customError';

export class GitError extends CustomError {
    statusCode = 500;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, GitError.prototype);
    }
}
