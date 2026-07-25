import type { Match, Member, Team, TeamResult } from '../types';
import { shuffleArray } from './shuffle';

export const TEAM_SIZE = 4;
export const MAX_TEAMS = 4;
const TEAM_NAME_LETTERS = ['A', 'B', 'C', 'D'];

export function generateTeamResult(participants: Member[]): TeamResult {
  const shuffled = shuffleArray(participants);

  const activePool = shuffled.slice(0, MAX_TEAMS * TEAM_SIZE);
  const overflowMembers = shuffled.slice(MAX_TEAMS * TEAM_SIZE);

  const teamCount = Math.floor(activePool.length / TEAM_SIZE);
  const waitingMembers = activePool.slice(teamCount * TEAM_SIZE);

  const teams: Team[] = [];
  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: `team-${i}`,
      name: `チーム${TEAM_NAME_LETTERS[i]}`,
      members: activePool.slice(i * TEAM_SIZE, i * TEAM_SIZE + TEAM_SIZE),
    });
  }

  const matches: Match[] = [];
  const waitingTeams: Team[] = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      matches.push({
        courtNumber: matches.length + 1,
        teamA: teams[i],
        teamB: teams[i + 1],
      });
    } else {
      waitingTeams.push(teams[i]);
    }
  }

  return { matches, waitingTeams, waitingMembers, overflowMembers };
}
