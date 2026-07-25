import { useState } from 'react';
import type { Member } from '../types';
import MemberList from './MemberList';
import MemberForm from './MemberForm';
import MemberManagement from './MemberManagement';

type Props = {
  members: Member[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAddMember: (name: string) => void;
  onRenameMember: (id: string, name: string) => string | null;
  onDeleteMember: (id: string) => void;
};

export default function MemberSelection({
  members,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onAddMember,
  onRenameMember,
  onDeleteMember,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  return (
    <section className="card member-selection">
      <div className="section-header">
        <h2>今日の参加者</h2>
        <span className="participant-count">参加者 {selectedIds.size}人</span>
      </div>

      <div className="bulk-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onSelectAll}>
          全員選択
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onDeselectAll}>
          全員解除
        </button>
      </div>

      <MemberList members={members} selectedIds={selectedIds} onToggle={onToggle} />

      <div className="member-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(true)}>
          ＋ メンバーを追加
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setShowManagement(true)}>
          メンバー管理
        </button>
      </div>

      {showForm && (
        <MemberForm
          existingNames={members.map((m) => m.name)}
          onAdd={onAddMember}
          onClose={() => setShowForm(false)}
        />
      )}

      {showManagement && (
        <MemberManagement
          members={members}
          onRename={onRenameMember}
          onDelete={onDeleteMember}
          onClose={() => setShowManagement(false)}
        />
      )}
    </section>
  );
}
