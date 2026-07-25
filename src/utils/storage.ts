import type { Member } from '../types';

const MEMBERS_KEY = 'members';
const SELECTED_MEMBER_IDS_KEY = 'selectedMemberIds';

const INITIAL_MEMBER_NAMES = [
  '山田',
  '田中',
  '佐藤',
  '鈴木',
  '高橋',
  '伊藤',
  '中村',
  '小林',
  '山本',
  '松本',
  '井上',
  '木村',
  '林',
  '清水',
  '山崎',
  '森',
];

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadMembers(): Member[] {
  const raw = localStorage.getItem(MEMBERS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Member[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // fall through to initial data
    }
  }
  const initialMembers = INITIAL_MEMBER_NAMES.map((name) => ({ id: createId(), name }));
  saveMembers(initialMembers);
  return initialMembers;
}

export function saveMembers(members: Member[]): void {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function loadSelectedMemberIds(): string[] {
  const raw = localStorage.getItem(SELECTED_MEMBER_IDS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSelectedMemberIds(ids: string[]): void {
  localStorage.setItem(SELECTED_MEMBER_IDS_KEY, JSON.stringify(ids));
}

export function createMember(name: string): Member {
  return { id: createId(), name };
}
