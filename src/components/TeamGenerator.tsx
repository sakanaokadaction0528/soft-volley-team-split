const MIN_PARTICIPANTS = 4;

type Props = {
  participantCount: number;
  onGenerate: () => void;
};

export default function TeamGenerator({ participantCount, onGenerate }: Props) {
  const canGenerate = participantCount >= MIN_PARTICIPANTS;

  return (
    <div className="generate-section">
      <button type="button" className="btn btn-generate" onClick={onGenerate} disabled={!canGenerate}>
        チーム分けする
      </button>
      {participantCount === 0 && <p className="generate-warning">参加者を選択してください</p>}
      {participantCount > 0 && participantCount < MIN_PARTICIPANTS && (
        <p className="generate-warning">チームを作るには4人以上選択してください</p>
      )}
    </div>
  );
}
