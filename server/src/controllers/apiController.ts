import type { Request, Response } from 'express';
import { getTeam, getTeamInfo, getTeams, getTeamStats, isLeague } from '../api/api.js';

export const teamInfo_get = async (req: Request, res: Response) => {
  const queryId = req.query.id;

  if (typeof queryId === 'string') {
    const id = parseInt(queryId);

    const data = await getTeamInfo(id);
    if (data === null) {
      res.status(500).json(JSON.stringify({ error: 'Unable to get team info' }));
      return;
    }

    res.json(JSON.stringify(data));
  }
};

export const teamStats_get = async (req: Request, res: Response) => {
  const queryId = req.query.id;

  if (typeof queryId === 'string') {
    const id = parseInt(queryId);

    const data = await getTeamStats(id);
    if (data === null) {
      res.status(500).json(JSON.stringify({ error: 'Unable to get team stats' }));
      return;
    }

    res.json(JSON.stringify(data));
  }
};

export const team_get = async (req: Request, res: Response) => {
  const queryId = req.query.id;

  if (typeof queryId === 'string') {
    const id = parseInt(queryId);

    const data = await getTeam(id);
    if (data === null) {
      res.status(500).json(JSON.stringify({ error: 'Unable to get team' }));
      return;
    }

    res.json(JSON.stringify(data));
  }
};

export const teams_get = async (req: Request, res: Response) => {
  const queryLeague = req.query.league;

  if (isLeague(queryLeague)) {
    const league = queryLeague;

    const data = await getTeams(league);
    if (data === null) {
      res.status(500).json(JSON.stringify({ error: 'Unable to get league teams' }));
      return;
    }

    res.json(JSON.stringify(data));
  }
};
