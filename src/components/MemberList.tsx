import type { Member } from '../types';

type Props = {
  members: Member[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

export default function MemberList({ members, selectedIds, onToggle }: Props) {
  if (members.length === 0) {
    return (
      <p className="empty-message">
        メンバーが登録されていません。「＋ メンバーを追加」から登録してください。
      </p>
    );
  }

  return (
    <ul className="member-list">
      {members.map((member) => (
        <li key={member.id} className="member-row">
          <label className="member-checkbox-label">
            <input
              type="checkbox"
              checked={selectedIds.has(member.id)}
              onChange={() => onToggle(member.id)}
            />
            <span>{member.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
