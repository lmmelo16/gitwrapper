#!/usr/bin/env -S npx tsx
import dotenv from 'dotenv';
dotenv.config();

import { createCommand } from 'commander';

import { CommitAction, ProjectAction } from './actions';

const program = createCommand();

program.version('1.0.0');

program
    .command('add <gitRepo>')
    .description('Add project to project list')
    .usage('<gitRepo>')
    .action(ProjectAction.createProject);

program
    .command('remove <gitRepo>')
    .alias('rm')
    .description('Remove project from project list')
    .usage('<gitRepo>')
    .action(ProjectAction.removeProject);

program
    .command('list')
    .alias('ls')
    .description('List all projects')
    .action(ProjectAction.listProjects);

program
    .command('commits <gitRepo>')
    .alias('c')
    .description('List commits of a project')
    .usage('<gitRepo>')
    .option('-n, --number <number>', 'Number of commits to list')
    .option('-f, --force', 'Force update cache before listing commits')
    .action(CommitAction.listCommits);

program.parse(process.argv);
