import { Request, Response } from 'express';
import { User } from '../generated/prisma/client.js';
import UserDB from '../models/user.js';

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
