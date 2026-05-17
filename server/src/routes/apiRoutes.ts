import { Router } from 'express';
import { leagueTeams_get, teamInfo_get, teamStats_get, team_get, teams_get } from '../controllers/apiController.js';

const router = Router();

router.get('/teaminfo/:id', teamInfo_get);
router.get('/teamstats/:id', teamStats_get);
router.get('/team/:id', team_get);
router.get('/teams/:league', leagueTeams_get);
router.get('/teams', teams_get);

export default router;
