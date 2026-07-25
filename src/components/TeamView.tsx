import type { Team } from '../types';
import PlayerChip from './PlayerChip';

type Props = {
  team: Team;
  label?: string;
};

export default function TeamView({ team, label }: Props) {
  const front = team.members.slice(0, 2);
  const back = team.members.slice(2, 4);

  return (
    <div className="team-view-card">
      {label && <div className="team-view-label">{label}</div>}
      <div className="court-title">{team.name}</div>
      <div className="court-rect court-rect-single">
        <div className="net-line net-line-top">
          <span>ネット</span>
        </div>
        <div className="court-row">
          {front.map((m) => (
            <PlayerChip key={m.id} name={m.name} />
          ))}
        </div>
        <div className="court-row">
          {back.map((m) => (
            <PlayerChip key={m.id} name={m.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
