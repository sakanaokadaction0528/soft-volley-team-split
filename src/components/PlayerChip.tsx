type Props = {
  name: string;
};

export default function PlayerChip({ name }: Props) {
  return (
    <div className="player-chip">
      <span className="player-avatar" aria-hidden="true">
        {name.charAt(0)}
      </span>
      <span className="player-name">{name}</span>
    </div>
  );
}
