import { Router } from 'express';
import { ProjectController } from './projects';
import { CommitController } from './commits';

const router = Router();

router.get('/projects', ProjectController.listProjects);
router.post('/projects', ProjectController.createProject);
router.delete('/projects/:gitRepo', ProjectController.removeProject);

router.get('/commits/:gitRepo', CommitController.listCommits);

export default router;
