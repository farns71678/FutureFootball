import { UserDB } from './db-types';
import { createTrio, TeamTrio } from './teamTrio';

type Profile = {
  name: string;
  email: string;
  picture?: Uint8Array;
};

type UserType = {
  profile: Profile;
  nflPicks?: TeamTrio;
  ncaaPicks?: TeamTrio;
  picksFinalized: boolean;
};

let user: UserType | null = null;

const loggedIn = () => {
  return user !== null;
};

const login = async (userData: UserDB) => {
  const nfl = userData.picks.picks.find((pick) => pick.league === 'NFL');
  const ncaa = userData.picks.picks.find((pick) => pick.league === 'NCAA');
  const nflTrio = nfl ? (await createTrio(nfl)) || undefined : undefined;
  const ncaaTrio = ncaa ? (await createTrio(ncaa)) || undefined : undefined;

  user = {
    profile: {
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    },
    nflPicks: nflTrio,
    ncaaPicks: ncaaTrio,
    picksFinalized: userData.picks.finalized,
  };
};

const getProfile = () => {
  return user ? user.profile : null;
};

const picksFinalized = () => {
  return user ? user.picksFinalized : false;
};

const User = { loggedIn, login, getProfile, picksFinalized };

export default User;
