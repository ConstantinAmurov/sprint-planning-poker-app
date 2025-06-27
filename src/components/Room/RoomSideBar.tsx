// components/RoomSidebar.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ParticipantList from "../ParticipantList";
import { Participant } from "@/types";

interface RoomSidebarProps {
  currentUser?: Participant;
  participants: Record<string, Participant>;
  isRevealed: boolean;
  onReset: () => void;
  onReveal: () => void;
}

export function RoomSidebar({
  currentUser,
  participants,
  isRevealed,
  onReset,
  onReveal,
}: Readonly<RoomSidebarProps>) {
  return (
    <aside className="w-64 bg-white rounded-lg shadow-md p-4 mr-8 flex-shrink-0 h-100%">
      <div className="flex flex-row gap-4 mb-6">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">{currentUser?.name}</h4>
          <p className="text-xs text-gray-500">{currentUser?.role}</p>
        </div>
      </div>

      {currentUser?.role === "creator" && (
        <div className="flex gap-3 justify-center">
          <Button className="text-xs" onClick={onReset}>
            Clear votes
          </Button>
          <Button className="text-xs" onClick={onReveal}>
            Show results
          </Button>
        </div>
      )}

      <h2 className="text-md text-gray-500 mb-1 mt-6">Players:</h2>
      <ParticipantList participants={participants} revealVotes={isRevealed} />
    </aside>
  );
}
