import { BadRequestError } from '@/errors';
import { Commit, Project } from '@/models';
import { Git } from '@/third-party';

// TODO - ideally this would be a web hook from the git provider
// Instead we will poll the git repo for new commits
const COMMIT_CACHE = 5; // minutes

export class CommitService {
    static async list(gitRepo: string, n: number = 10) {
        const project = await Project.findOne({
            $or: [{ gitRepo }, { name: gitRepo }],
        });

        if (!project) throw new BadRequestError('Project not found');

        const updated = await CommitService.updateCommitCache(gitRepo);

        // Retrive last n commits
        const commits = await Commit.find({ project: project._id })
            .sort({ date: -1 })
            .limit(n);

        return { commits, updated };
    }

    static async getCommitCount(gitRepo: string) {
        const project = await Project.findOne({
            $or: [{ gitRepo }, { name: gitRepo }],
        });

        if (!project) throw new BadRequestError('Project not found');

        await CommitService.updateCommitCache(gitRepo);

        return project.commits.length;
    }

    static async updateCommitCache(gitRepo: string, force: boolean = false) {
        const project = await Project.findOne({
            $or: [{ gitRepo }, { name: gitRepo }],
        });

        if (!project) throw new BadRequestError('Project not found');

        const minutesSinceLastPull = project.getTimeSinceLastPull();

        if (force || minutesSinceLastPull >= COMMIT_CACHE) {
            const git = new Git(project.gitRepo, project.path);

            const totalCommits = await git.getTotalCommitCount();

            const projectSavedCommitCount = project.commits.length;

            const newCommits = totalCommits - projectSavedCommitCount;

            if (newCommits > 0) {
                console.log(`Found ${newCommits} new commits`);

                const commits = await git.getCommits(newCommits);

                const newCommitIds = [];

                for (const commit of commits) {
                    const newCommit = Commit.build({
                        commitHash: commit.hash,
                        author: commit.author + ' <' + commit.email + '>',
                        date: commit.date,
                        message: commit.subject,
                        project: project._id,
                    });

                    await newCommit.save();

                    newCommitIds.push(newCommit._id);
                }

                project.commits = [...project.commits, ...newCommitIds];
            }

            project.lastCommitPull = new Date();

            await project.save();

            return true;
        }

        return false;
    }
}
