import { CommitService } from '@/services';

import { connectMongoDB } from '@/database';

import { CustomError } from '@/errors/customError';

export class CommitAction {
    static async listCommits(
        gitRepo: string,
        { number, force }: { number: number; force: boolean }
    ) {
        try {
            await connectMongoDB();

            if (force) {
                await CommitService.updateCommitCache(gitRepo, true);
            }

            const { commits } = await CommitService.list(gitRepo, number);

            const totalCommits = await CommitService.getCommitCount(gitRepo);

            console.log('Total Commits: ' + totalCommits);
            for (const commit of commits) {
                console.log(
                    `- ${commit.author} - ${commit.date} - ${commit.message}`
                );
            }
        } catch (error) {
            if (error instanceof CustomError)
                console.error('> ' + error.message);
            else console.error('> An error occurred while listing commits');
            return;
        } finally {
            process.exit(0);
        }
    }
}
