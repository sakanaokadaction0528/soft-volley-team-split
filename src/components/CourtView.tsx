import type { Match, Member } from '../types';
import PlayerChip from './PlayerChip';

type Props = {
  match: Match;
};

function splitRows(members: Member[]) {
  return {
    front: members.slice(0, 2),
    back: members.slice(2, 4),
  };
}

const SIDE_LABELS: Record<number, { side: 'left' | 'right'; text: string }> = {
  1: { side: 'left', text: '入り口' },
  2: { side: 'right', text: 'ステージ' },
};

export default function CourtView({ match }: Props) {
  const teamA = splitRows(match.teamA.members);
  const teamB = splitRows(match.teamB.members);
  const sideLabel = SIDE_LABELS[match.courtNumber];

  return (
    <div className="court-card">
      <div className="court-title">コート{match.courtNumber}</div>
      <div className="court-rect-wrapper">
        {sideLabel?.side === 'left' && (
          <div className="court-side-label">{sideLabel.text}</div>
        )}
        <div className="court-rect">
          <div className="court-team-label">{match.teamA.name}</div>
          <div className="court-row">
            {teamA.back.map((m) => (
              <PlayerChip key={m.id} name={m.name} />
            ))}
          </div>
          <div className="court-row">
            {teamA.front.map((m) => (
              <PlayerChip key={m.id} name={m.name} />
            ))}
          </div>

          <div className="net-line">
            <span>ネット</span>
          </div>

          <div className="court-row">
            {teamB.front.map((m) => (
              <PlayerChip key={m.id} name={m.name} />
            ))}
          </div>
          <div className="court-row">
            {teamB.back.map((m) => (
              <PlayerChip key={m.id} name={m.name} />
            ))}
          </div>
          <div className="court-team-label">{match.teamB.name}</div>
        </div>
        {sideLabel?.side === 'right' && (
          <div className="court-side-label">{sideLabel.text}</div>
        )}
      </div>
    </div>
  );
}
