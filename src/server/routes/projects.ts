import { Request, Response } from 'express';

import { ProjectService } from '@/services';

import { BadRequestError } from '@/errors';
import { JaegerTracer } from '@/metrics';

export class ProjectController {
    static async createProject(req: Request, res: Response) {
        req.trace.startSpan('createProject');

        const { gitRepo } = req.body;

        if (!gitRepo) throw new BadRequestError('Git repository is required');

        const project = await ProjectService.addProject(gitRepo);

        return res.json(project);
    }

    static async removeProject(req: Request, res: Response) {
        req.trace.startSpan('removeProject');

        const { gitRepo } = req.params;

        if (!gitRepo) throw new BadRequestError('Git repository is required');

        const project = await ProjectService.removeProject(gitRepo);

        return res.json(project);
    }

    static async listProjects(req: Request, res: Response) {
        req.trace.startSpan('listProjects');

        const projects = await ProjectService.listProjects();

        return res.json(projects);
    }
}
