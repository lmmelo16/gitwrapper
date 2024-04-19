import { Request, Response } from 'express';

import { CommitService } from '@/services';

import { BadRequestError } from '@/errors';
import { JaegerTracer } from '@/metrics';

export class CommitController {
    static async listCommits(req: Request, res: Response) {
        req.trace.startSpan('listCommits');

        const { gitRepo } = req.params;
        const { number } = req.query;

        if (!gitRepo) throw new BadRequestError('Git repository is required');

        let commitList;

        if (number) {
            const n = parseInt(number as string);
            commitList = await CommitService.list(gitRepo, n);
        } else {
            commitList = await CommitService.list(gitRepo);
        }

        const { commits, updated } = commitList;

        if (updated) req.trace.addTag('commits.updated', 'true');
        else req.trace.addTag('commits.updated', 'false');

        const totalCommits = await CommitService.getCommitCount(gitRepo);

        return res.json({ commits, totalCommits });
    }
}
