"use client";
import { Participant } from "@/types";

interface ParticipantListProps {
  participants: Record<string, Participant>;
  revealVotes?: boolean;
}

export default function ParticipantList({
  participants,
  revealVotes,
}: Readonly<ParticipantListProps>) {
  return (
    <div className="flex flex-col">
      {Object.entries(participants).map(([id, { name, vote }]) => {
        return (
          <span
            key={id}
            className="mb-1 font-medium text-gray-700 dark:text-gray-200"
          >
            {name} - {revealVotes ? vote ?? "Not voted yet" : "Vote hidden"}
          </span>
        );
      })}
    </div>
  );
}
