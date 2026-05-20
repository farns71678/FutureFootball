import { Request, Response } from 'express';
import UserDB from '../db/user.js';
import { User } from '../generated/prisma/client.js';

export const userPicks_get = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const picks = await UserDB.picks(user.id);

  if (picks) res.json({ picks });
  else res.status(404).json({ message: 'Not found' });
};

export const userMemberships_get = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const memberships = await UserDB.memberships(user.id);
  res.json({ memberships });
};

export const userGroupsOwned_get = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const groupsOwned = await UserDB.groupsOwned(user.id);
  res.json({ groups: groupsOwned });
};

export const userPicks_post = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { nfl, ncaa } = req.body;

  if (
    Array.isArray(nfl) &&
    nfl.every((teamId) => typeof teamId === 'number') &&
    Array.isArray(ncaa) &&
    ncaa.every((teamId) => typeof teamId === 'number')
  ) {
    const picks = await UserDB.setPicks(user.id, nfl, ncaa);
    res.json({ picks });
  } else {
    res.status(400).json({ message: 'Invalid query body' });
  }
};
