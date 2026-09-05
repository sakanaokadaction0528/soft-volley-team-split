import { useEffect, useMemo, useState } from 'react';
import { generateTeamResult, validateFixedTeams } from './utils/teamGenerator';
import { createMember, subscribeToSession, updateSession, type SessionState } from './utils/session';
import Header from './components/Header';
import MemberSelection from './components/MemberSelection';
import TeamGenerator from './components/TeamGenerator';
import ResultView from './components/ResultView';
import './App.css';

function App() {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSession(setSession);
    return unsubscribe;
  }, []);

  const members = session?.members ?? [];
  const selectedIds = useMemo(() => new Set(session?.selectedMemberIds ?? []), [session]);

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedIds.has(m.id)),
    [members, selectedIds],
  );

  const fixedTeamError = useMemo(() => validateFixedTeams(selectedMembers), [selectedMembers]);

  if (!session) {
    return (
      <div className="app">
        <Header />
        <main className="app-main">
          <p className="loading-message">読み込み中...</p>
        </main>
      </div>
    );
  }

  const toggleMember = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    updateSession({ selectedMemberIds: [...next] });
  };

  const selectAll = () => updateSession({ selectedMemberIds: members.map((m) => m.id) });
  const deselectAll = () => updateSession({ selectedMemberIds: [] });

  const addMember = (name: string) => {
    const member = createMember(name);
    updateSession({
      members: [...members, member],
      selectedMemberIds: [...selectedIds, member.id],
    });
  };

  const renameMember = (id: string, newName: string): string | null => {
    const duplicate = members.some((m) => m.id !== id && m.name === newName);
    if (duplicate) {
      return '同じ名前のメンバーが登録されています';
    }
    updateSession({
      members: members.map((m) => (m.id === id ? { ...m, name: newName } : m)),
    });
    return null;
  };

  const deleteMember = (id: string) => {
    const next = new Set(selectedIds);
    next.delete(id);
    updateSession({
      members: members.filter((m) => m.id !== id),
      selectedMemberIds: [...next],
    });
  };

  const setFixedTeam = (id: string, fixedTeam: number | null) => {
    updateSession({
      members: members.map((m) => (m.id === id ? { ...m, fixedTeam } : m)),
    });
  };

  const setLevel = (id: string, level: number | null) => {
    updateSession({
      members: members.map((m) => (m.id === id ? { ...m, level } : m)),
    });
  };

  const generateTeams = () => {
    if (selectedMembers.length < 4 || fixedTeamError) return;
    updateSession({ result: generateTeamResult(selectedMembers), phase: 'result' });
  };

  const reshuffle = () => {
    if (selectedMembers.length < 4 || fixedTeamError) return;
    updateSession({ result: generateTeamResult(selectedMembers) });
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {session.phase === 'selection' ? (
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
              onSetFixedTeam={setFixedTeam}
              onSetLevel={setLevel}
            />
            <TeamGenerator
              participantCount={selectedMembers.length}
              errorMessage={fixedTeamError}
              onGenerate={generateTeams}
            />
          </>
        ) : (
          session.result && (
            <ResultView
              result={session.result}
              onReshuffle={reshuffle}
              onChangeParticipants={() => updateSession({ phase: 'selection' })}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;
