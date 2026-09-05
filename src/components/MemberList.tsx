import type { Member } from '../types';

type Props = {
  members: Member[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSetFixedTeam: (id: string, fixedTeam: number | null) => void;
};

export default function MemberList({ members, selectedIds, onToggle, onSetFixedTeam }: Props) {
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
            <span className="member-name-text">{member.name}</span>
          </label>
          <select
            className={`team-select${member.fixedTeam ? ` team-select-${member.fixedTeam}` : ''}`}
            value={member.fixedTeam ?? ''}
            onChange={(e) => onSetFixedTeam(member.id, e.target.value ? Number(e.target.value) : null)}
            aria-label={`${member.name}の固定チーム`}
          >
            <option value="">チーム選択</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </li>
      ))}
    </ul>
  );
}
