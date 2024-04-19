import { connectMongoDB } from '@/database';
import { CustomError } from '@/errors/customError';

import { ProjectService } from '@/services';

export class ProjectAction {
    static async createProject(gitRepo: string) {
        try {
            // TODO - need to connect in each command because Commander exists after each command
            await connectMongoDB();

            const project = await ProjectService.addProject(gitRepo);

            console.log(`Project ${project.name} added successfully`);
        } catch (error) {
            if (error instanceof CustomError)
                console.error('> ' + error.message);
            else console.error('> An error occurred while adding project:');
        } finally {
            process.exit(0);
        }
    }

    static async removeProject(gitRepo: string) {
        try {
            await connectMongoDB();

            const project = await ProjectService.removeProject(gitRepo);

            console.log(`Project ${project.name} removed successfully`);
        } catch (error) {
            if (error instanceof CustomError)
                console.error('> ' + error.message);
            else console.error('> An error occurred while removing project');
        } finally {
            process.exit(0);
        }
    }

    static async listProjects() {
        try {
            await connectMongoDB();

            const projects = await ProjectService.listProjects();

            console.log(`Projects: ${projects.length}`);

            projects.forEach((project, i) => {
                console.log(`${i + 1}. ${project.name} - ${project.gitRepo}`);
            });
        } catch (error) {
            if (error instanceof CustomError)
                console.error('> ' + error.message);
            else console.error('> An error occurred while listing projects');
            return;
        } finally {
            process.exit(0);
        }
    }
}
