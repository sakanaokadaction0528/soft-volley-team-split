export type Member = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  members: Member[];
};

export type Match = {
  courtNumber: number;
  teamA: Team;
  teamB: Team;
};

export type TeamResult = {
  matches: Match[];
  waitingTeams: Team[];
  waitingMembers: Member[];
  overflowMembers: Member[];
};
