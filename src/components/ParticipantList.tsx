"use client";
import { Participant } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ParticipantListProps {
  participants: Record<string, Participant>;
  revealVotes?: boolean;
}

function getEmojiForVote(vote: string | number | undefined): string | null {
  if (vote === undefined) return null;
  switch (vote) {
    case "1":
    case 1:
      return "😐";
    case "3":
    case 3:
      return "🙂";
    case "5":
    case 5:
      return "😃";
    case "8":
    case 8:
      return "🤓";
    case "13":
    case 13:
      return "🧠";
    case "?":
      return "❓";
    case "coffee":
      return "☕";
    default:
      return "🗳️";
  }
}

export default function ParticipantList({
  participants,
  revealVotes,
}: Readonly<ParticipantListProps>) {
  return (
    <div className="flex flex-col space-y-2">
      {Object.entries(participants).map(([id, { name, vote }]) => {
        const emoji = getEmojiForVote(vote);
        return (
          <div
            key={id}
            className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            <span className="mr-2">{name} -</span>
            <AnimatePresence mode="wait" initial={false}>
              {revealVotes ? (
                <motion.span
                  key="vote"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2"
                >
                  {vote ?? "Not voted yet"}
                  {emoji && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {emoji}
                    </motion.span>
                  )}
                </motion.span>
              ) : (
                <motion.span
                  key="hidden"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block italic text-gray-500"
                >
                  Vote hidden
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
