export type Member = {
  id: string;
  name: string;
  // 1〜4のいずれか、または未指定(null)。同じ番号の参加者は同じチームに固定される。
  fixedTeam: number | null;
  // バレーレベル(クラス)。1(初級)〜5(上級)、または未評価(null)。
  level: number | null;
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
