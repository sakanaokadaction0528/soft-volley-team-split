import type { Member } from '../types';

type Props = {
  members: Member[];
};

export default function WaitingMembers({ members }: Props) {
  if (members.length === 0) return null;

  return (
    <div className="waiting-members-card">
      <div className="waiting-members-title">待機メンバー（{members.length}人）</div>
      <div className="waiting-members-chips">
        {members.map((m) => (
          <span key={m.id} className="waiting-chip">
            {m.name}
          </span>
        ))}
      </div>
    </div>
  );
}
