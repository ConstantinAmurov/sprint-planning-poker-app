"use client";
import type { Participant } from "@/types/types";

interface ParticipantListProps {
  participants: Record<string, Participant>;
}

export default function ParticipantList({
  participants,
}: Readonly<ParticipantListProps>) {
  return (
    <div className="flex flex-col">
      {Object.entries(participants).map(([id, { name }]) => {
        return (
          <span
            key={id}
            className="mb-1 font-medium text-gray-700 dark:text-gray-200"
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}
