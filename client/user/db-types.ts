import { League } from './api';

export type UserDB = {
  name: string;
  email: string;
  picture?: Uint8Array;
  picks: {
    season: number;
    finalized: boolean;
    picks: {
      league: League;
      teams: number[];
    }[];
  };
};
