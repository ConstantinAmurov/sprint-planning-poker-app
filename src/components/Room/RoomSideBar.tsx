// components/RoomSidebar.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ParticipantList from "./ParticipantList";
import { Participant } from "@/types";
import { DarkModeToggle } from "./DarkModeToggle";

interface RoomSidebarProps {
  className?: string;
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
  className = "",
}: Readonly<RoomSidebarProps>) {
  return (
    <aside
      className={`mr-8 flex-shrink-0 relative h-full bg-card p-4 rounded-lg shadow-md ${className}`}
    >
      <div className="flex flex-row gap-4 mb-6">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">{currentUser?.name}</h4>
          <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
        </div>
      </div>

      {currentUser?.role === "creator" && (
        <div className="flex gap-3 justify-center mb-4">
          <Button className="text-xs" onClick={onReset}>
            Clear votes
          </Button>
          <Button className="text-xs" onClick={onReveal}>
            {isRevealed ? "Hide results" : "Reveal results"}
          </Button>
        </div>
      )}

      <h2 className="text-md text-muted-foreground mb-1 mt-6">Players:</h2>
      <ParticipantList participants={participants} revealVotes={isRevealed} />
      <div className="mt-6">
        <DarkModeToggle />
      </div>
    </aside>
  );
}
