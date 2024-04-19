import { Request, Response, NextFunction } from 'express';

import { CustomError, IError } from '@/errors';

const defaultError: IError = {
    message: 'An error occurred',
};

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        req.trace?.addTag('http.error', err.message);
        return res.status(err.statusCode).json({ errors: err.serializer() });
    }

    console.log(err);

    return res.status(500).json({ errors: defaultError });
};
