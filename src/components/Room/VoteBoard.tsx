import Card from "@/components/Card";
import { VoteValue } from "@/types";

const VOTE_OPTIONS = ["1", "2", "3", "5", "8", "13"];

interface VoteBoardProps {
  currentVote?: VoteValue;
  onVote: (vote: string) => void;
}

export function VoteBoard({ currentVote, onVote }: Readonly<VoteBoardProps>) {
  return (
    <div className="flex flex-wrap justify-center gap-4 bg-card p-4 rounded-lg shadow-md">
      {VOTE_OPTIONS.map((point) => (
        <Card
          key={point}
          value={point}
          onClick={() => onVote(point)}
          className={
            currentVote === point ? "ring-4 ring-primary border-primary" : ""
          }
        />
      ))}
    </div>
  );
}
