import type { Match, Member, Team, TeamResult } from '../types';
import { shuffleArray } from './shuffle';

export const TEAM_SIZE = 4;
export const MAX_TEAMS = 4;
const TEAM_NAME_LETTERS = ['A', 'B', 'C', 'D'];
export const FIXED_TEAM_NUMBERS = [1, 2, 3, 4];
// レベル未評価のメンバーは中間(3)として扱う
const NEUTRAL_LEVEL = 3;

function isFixedTeamNumber(value: number | null): value is number {
  return value !== null && FIXED_TEAM_NUMBERS.includes(value);
}

function effectiveLevel(member: Member): number {
  return member.level ?? NEUTRAL_LEVEL;
}

function teamStrength(members: Member[]): number {
  return members.reduce((sum, m) => sum + effectiveLevel(m), 0);
}

/**
 * 今日の参加者の中に、1チーム(4人)に入りきらない固定チーム指定がないか確認する。
 * 問題がなければ null、問題があればユーザー向けのエラーメッセージを返す。
 */
export function validateFixedTeams(participants: Member[]): string | null {
  for (const num of FIXED_TEAM_NUMBERS) {
    const count = participants.filter((m) => m.fixedTeam === num).length;
    if (count > TEAM_SIZE) {
      return `チーム${num}を指定している参加者が${count}人います。1チームは4人までにしてください。`;
    }
  }
  return null;
}

type TeamSlot = {
  members: Member[];
};

export function generateTeamResult(participants: Member[]): TeamResult {
  // 同じ固定チーム番号ごとにグループ化(番号未指定・無効な値は自由枠へ)
  const fixedGroups = FIXED_TEAM_NUMBERS.map((num) =>
    participants.filter((m) => m.fixedTeam === num),
  ).filter((group) => group.length > 0);

  const freePool = participants.filter((m) => !isFixedTeamNumber(m.fixedTeam));

  // 固定チームをチーム枠として確保(レベルバランスの土台になる)
  const slots: TeamSlot[] = fixedGroups.map((group) => ({ members: [...group] }));

  const totalFillerNeeded = slots.reduce((sum, slot) => sum + (TEAM_SIZE - slot.members.length), 0);
  const remainingAfterFixedFill = Math.max(0, freePool.length - totalFillerNeeded);
  const maxAdditionalSlots = MAX_TEAMS - slots.length;
  const pureFreeTeamCount = Math.min(Math.floor(remainingAfterFixedFill / TEAM_SIZE), maxAdditionalSlots);
  for (let i = 0; i < pureFreeTeamCount; i++) {
    slots.push({ members: [] });
  }

  // レベルが高い人から順に、その時点で最も合計レベルが低い(＝手薄な)枠へ割り振っていくことで
  // 固定チームの穴埋めと自由枠の編成を同時にバランスさせる。同レベル内の割り振り順はシャッフルする。
  const sortedFree = shuffleArray(freePool).sort((a, b) => effectiveLevel(b) - effectiveLevel(a));

  const waitingMembers: Member[] = [];

  for (const member of sortedFree) {
    const candidates = slots.filter((s) => s.members.length < TEAM_SIZE);
    if (candidates.length === 0) {
      waitingMembers.push(member);
      continue;
    }
    candidates.sort((a, b) => teamStrength(a.members) - teamStrength(b.members));
    candidates[0].members.push(member);
  }

  // 4人に満たない枠(参加者不足で完成できなかった固定チーム)は組めないので待機扱いにする
  const completeTeamMembers = slots
    .filter((s) => s.members.length === TEAM_SIZE)
    .map((s) => shuffleArray(s.members)); // チーム内の並び(前後衛)をランダム化
  slots
    .filter((s) => s.members.length < TEAM_SIZE)
    .forEach((s) => waitingMembers.push(...s.members));

  // 実力が近いチーム同士が対戦するよう、合計レベルで並べてから隣同士を組ませる
  const sortedByStrength = [...completeTeamMembers].sort(
    (a, b) => teamStrength(b) - teamStrength(a),
  );

  const pairs: Member[][][] = [];
  const soloTeams: Member[][] = [];
  for (let i = 0; i < sortedByStrength.length; i += 2) {
    if (sortedByStrength[i + 1]) {
      // どちらが「チームA」側になるかはランダムにする
      pairs.push(shuffleArray([sortedByStrength[i], sortedByStrength[i + 1]]));
    } else {
      soloTeams.push(sortedByStrength[i]);
    }
  }
  // どのペアがコート1になるかはランダムにする
  const shuffledPairs = shuffleArray(pairs);

  const matches: Match[] = [];
  const waitingTeams: Team[] = [];
  let letterIndex = 0;

  shuffledPairs.forEach((pair, i) => {
    const teamA: Team = {
      id: `team-${letterIndex}`,
      name: `チーム${TEAM_NAME_LETTERS[letterIndex]}`,
      members: pair[0],
    };
    letterIndex++;
    const teamB: Team = {
      id: `team-${letterIndex}`,
      name: `チーム${TEAM_NAME_LETTERS[letterIndex]}`,
      members: pair[1],
    };
    letterIndex++;
    matches.push({ courtNumber: i + 1, teamA, teamB });
  });

  soloTeams.forEach((members) => {
    waitingTeams.push({
      id: `team-${letterIndex}`,
      name: `チーム${TEAM_NAME_LETTERS[letterIndex]}`,
      members,
    });
    letterIndex++;
  });

  return { matches, waitingTeams, waitingMembers, overflowMembers: [] };
}
