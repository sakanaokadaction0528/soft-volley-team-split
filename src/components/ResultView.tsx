import type { TeamResult } from '../types';
import CourtView from './CourtView';
import TeamView from './TeamView';
import WaitingMembers from './WaitingMembers';

type Props = {
  result: TeamResult;
  onReshuffle: () => void;
  onChangeParticipants: () => void;
};

export default function ResultView({ result, onReshuffle, onChangeParticipants }: Props) {
  const waitingMembers = [...result.waitingMembers, ...result.overflowMembers];

  return (
    <section className="card result-view">
      <div className="result-actions-top">
        <button type="button" className="btn btn-generate" onClick={onReshuffle}>
          もう一度チーム分け
        </button>
        <button type="button" className="btn btn-outline" onClick={onChangeParticipants}>
          参加者を変更
        </button>
      </div>

      <div className="courts-grid">
        {result.matches.map((match) => (
          <CourtView key={match.courtNumber} match={match} />
        ))}
      </div>

      {result.waitingTeams.length > 0 && (
        <div className="waiting-teams-grid">
          {result.waitingTeams.map((team) => (
            <TeamView key={team.id} team={team} label="待機チーム" />
          ))}
        </div>
      )}

      <WaitingMembers members={waitingMembers} />
    </section>
  );
}
