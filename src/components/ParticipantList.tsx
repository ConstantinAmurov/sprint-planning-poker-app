"use client";
import Card from "./Card";

interface ParticipantListProps {
  participants: Record<string, string>;
  votes: Record<string, string>;
  reveal: boolean;
}

export default function ParticipantList({
  participants,
  votes,
  reveal,
}: Readonly<ParticipantListProps>) {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      {Object.entries(participants).map(([id, name]) => {
        const vote = votes[id];
        const display = reveal ? vote || "-" : "-";
        return (
          <div key={id} className="flex flex-col items-center">
            <span className="mb-2 font-medium text-gray-700 dark:text-gray-200">
              {name}
            </span>
            <Card value={display} onClick={() => {}} />
          </div>
        );
      })}
    </div>
  );
}
