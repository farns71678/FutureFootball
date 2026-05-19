import bcrypt from 'bcrypt';
import { assert, object, refine, size, string } from 'superstruct';
import isEmail from 'validator/lib/isEmail.js';
import { prisma } from '../db/db.js';
import { League } from '../generated/prisma/enums.js';

const Signup = object({
  email: refine(string(), 'email', (v) => isEmail.default(v)),
  password: size(string(), 8, 30),
  name: size(string(), 3, 30),
});

const create = async (email: string, name: string, password: string) => {
  assert({ email, name, password }, Signup);
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  return await prisma.user.create({ data: { email, name, password } });
};

const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};

// get info
const picks = async (userId: number) => {
  const picks = await prisma.userPicks.findUnique({ where: { userId }, include: { picks: true } });

  return picks
    ? { season: picks.season, picks: picks.picks.map((pick) => ({ league: pick.league, teams: pick.teams })) }
    : null;
};

const memberships = async (userId: number) => {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: { memberPicks: true, group: true },
  });

  return memberships.map((membership) => ({
    id: membership.id,
    season: membership.season,
    group: membership.group,
    picks: membership.memberPicks,
  }));
};

const groupsOwned = async (userId: number) => {
  const groupsOwned = await prisma.group.findMany({ where: { ownerId: userId } });
  return groupsOwned;
};

// set data
interface PickStorage {
  league: League;
  teams: number[];
}

const setPicks = async (userId: number, picks: PickStorage[]) => {
  // todo: implement creating picks
};

const UserDB = { create, login, picks, memberships, groupsOwned };

export default UserDB;
