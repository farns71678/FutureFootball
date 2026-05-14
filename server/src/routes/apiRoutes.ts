import { Router } from 'express';
import { teamInfo_get, teamStats_get, team_get, teams_get } from '../controllers/apiController.js';

const router = Router();

router.get('/teaminfo/:id', teamInfo_get);
router.get('/teamstats/:id', teamStats_get);
router.get('/team/:id', team_get);
router.get('/teams/:league', teams_get);

export default router;
