import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import type { Member, TeamResult } from '../types';

export type Phase = 'selection' | 'result';

export type SessionState = {
  members: Member[];
  selectedMemberIds: string[];
  phase: Phase;
  result: TeamResult | null;
};

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

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createMember(name: string): Member {
  return { id: createId(), name, fixedTeam: null, level: null };
}

function createInitialSessionState(): SessionState {
  return {
    members: INITIAL_MEMBER_NAMES.map((name) => createMember(name)),
    selectedMemberIds: [],
    phase: 'selection',
    result: null,
  };
}

const sessionRef = doc(db, 'sessions', 'main');

export function subscribeToSession(onChange: (state: SessionState) => void): Unsubscribe {
  return onSnapshot(
    sessionRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        void setDoc(sessionRef, createInitialSessionState());
        return;
      }
      onChange(snapshot.data() as SessionState);
    },
    (error) => {
      console.error('Firestore subscribe error:', error.code, error.message);
    },
  );
}

export function updateSession(partial: Partial<SessionState>): Promise<void> {
  return setDoc(sessionRef, partial, { merge: true });
}
