import { execa } from 'execa';

import { v4 } from 'uuid';

import { GitError } from '@/errors';

import fs from 'fs';

const BASE_PATH = '/tmp/git';

// Information parsed from the git log
interface ICommit {
    hash: string;
    author: string;
    email: string;
    date: string;
    subject: string;
}

// Works as a separator for the output
const SPECIAL_CARACTER = '||||';

export class Git {
    private path: string;
    private name: string;
    private gitRepo: string;

    constructor(gitRepo: string, path?: string) {
        this.gitRepo = gitRepo;
        this.path = path || `${BASE_PATH}/${v4()}`;
        this.name = this.getName();
    }

    async clone() {
        try {
            // check if the path exists in folder
            const exists = fs.existsSync(this.path);

            // Is need to check because folder used is a tmp folder
            if (!exists) await execa('git', ['clone', this.gitRepo, this.path]);

            return !exists;
        } catch (error) {
            console.log(error);
            throw new GitError('Failed to clone the repository');
        }
    }

    async getTotalCommitCount() {
        try {
            await this.clone();

            const args = ['rev-list', '--count', 'HEAD'];

            const { stdout } = await execa('git', args, { cwd: this.path });

            return parseInt(stdout);
        } catch (error) {
            throw new GitError('Failed to get total commit count');
        }
    }

    async getCommits(end?: number, start?: number): Promise<ICommit[]> {
        // https://git-scm.com/docs/pretty-formats
        try {
            await this.clone();

            const args = [
                'log',
                `--pretty=format:%H${SPECIAL_CARACTER}%an${SPECIAL_CARACTER}%ae${SPECIAL_CARACTER}%cd${SPECIAL_CARACTER}%s`,
            ];

            if (end && start) {
                end -= start;
                args.push(`-${end}`);
                args.push(`--skip=${start}`);
            } else if (end) {
                args.push(`-${end}`);
            }

            const { stdout } = await execa('git', args, { cwd: this.path });

            return this.parseCommits(stdout);
        } catch (error) {
            throw new GitError('Failed to get commits');
        }
    }

    async remove() {
        try {
            await execa('rm', ['-rf', this.path]);
        } catch (error) {
            throw new GitError('Failed to remove the repository');
        }
    }

    parseCommits(stdout: string): ICommit[] {
        // Format: hash author email date subject
        const commits: ICommit[] = [];

        const lines = stdout
            .split('\n')
            .map(line => line.split(SPECIAL_CARACTER));

        for (const line of lines) {
            const [hash, author, email, date, ...subject] = line;

            commits.push({
                hash,
                author,
                email,
                date,
                subject: subject.join(' '),
            });
        }

        return commits;
    }

    getName() {
        // TODO - could be add regex to validate git repo

        // Gets last part of the path
        // Ex: https://github.com/codacy/codacy-orbs.git -> codacy-orbs
        return this.gitRepo.split('/').pop()?.replace('.git', '') as string;
    }

    getPath() {
        return this.path;
    }
}
