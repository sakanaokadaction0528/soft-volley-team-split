import { useEffect, useMemo, useState } from 'react';
import type { Member, TeamResult } from './types';
import { generateTeamResult } from './utils/teamGenerator';
import {
  createMember,
  loadMembers,
  loadSelectedMemberIds,
  saveMembers,
  saveSelectedMemberIds,
} from './utils/storage';
import Header from './components/Header';
import MemberSelection from './components/MemberSelection';
import TeamGenerator from './components/TeamGenerator';
import ResultView from './components/ResultView';
import './App.css';

type Phase = 'selection' | 'result';

function App() {
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const stored = loadSelectedMemberIds();
    const validIds = new Set(loadMembers().map((m) => m.id));
    return new Set(stored.filter((id) => validIds.has(id)));
  });
  const [phase, setPhase] = useState<Phase>('selection');
  const [result, setResult] = useState<TeamResult | null>(null);

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveSelectedMemberIds([...selectedIds]);
  }, [selectedIds]);

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedIds.has(m.id)),
    [members, selectedIds],
  );

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(members.map((m) => m.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const addMember = (name: string) => {
    const member = createMember(name);
    setMembers((prev) => [...prev, member]);
    setSelectedIds((prev) => new Set(prev).add(member.id));
  };

  const renameMember = (id: string, newName: string): string | null => {
    const duplicate = members.some((m) => m.id !== id && m.name === newName);
    if (duplicate) {
      return '同じ名前のメンバーが登録されています';
    }
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, name: newName } : m)));
    return null;
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const generateTeams = () => {
    if (selectedMembers.length < 4) return;
    setResult(generateTeamResult(selectedMembers));
    setPhase('result');
  };

  const reshuffle = () => {
    if (selectedMembers.length < 4) return;
    setResult(generateTeamResult(selectedMembers));
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {phase === 'selection' ? (
          <>
            <MemberSelection
              members={members}
              selectedIds={selectedIds}
              onToggle={toggleMember}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onAddMember={addMember}
              onRenameMember={renameMember}
              onDeleteMember={deleteMember}
            />
            <TeamGenerator participantCount={selectedMembers.length} onGenerate={generateTeams} />
          </>
        ) : (
          result && (
            <ResultView
              result={result}
              onReshuffle={reshuffle}
              onChangeParticipants={() => setPhase('selection')}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;
