import { Project } from '@/models';

import { Git } from '@/third-party';

import { BadRequestError } from '@/errors';

export class ProjectService {
    static async addProject(gitRepo: string) {
        try {
            const exists = await Project.exists({ gitRepo });

            if (exists) throw new BadRequestError('Project already exists');

            const git = new Git(gitRepo);

            // TODO - could be done in a background job
            await git.clone();

            const name = git.getName();

            const path = git.getPath();

            const project = Project.build({ gitRepo, name, path });

            await project.save();

            return project;
        } catch (error) {
            throw error;
        }
    }

    static async removeProject(gitRepo: string) {
        try {
            const project = await Project.findOne({
                $or: [{ gitRepo }, { name: gitRepo }],
            });

            if (!project) throw new BadRequestError('Project not found');

            const git = new Git(project.gitRepo, project.path);

            // TODO - could be done in a background job
            await git.remove();

            await project.delete();

            return project;
        } catch (error) {
            throw error;
        }
    }

    static async listProjects() {
        try {
            return await Project.find();
        } catch (error) {
            throw error;
        }
    }
}
