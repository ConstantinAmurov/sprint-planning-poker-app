"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketProvider";
import { useRoomStore } from "@/store/useRoomStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { RoomSidebar } from "@/components/Room/RoomSideBar";
import { VoteBoard } from "@/components/Room/VoteBoard";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const name = search.get("name");
  const currentUser = useCurrentUser();
  const { isRevealed, participants } = useRoomStore();
  const socket = useSocket();
  const router = useRouter();
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!name) {
      router.push(`/?session=${id}`);
      return;
    }

    if (socket && !hasJoined.current) {
      socket.emit("join", { roomId: id, name });
      hasJoined.current = true;
      console.log(`User ${name} joined room ${id}`);
    }
  }, [id, name, socket, router]);

  const castVote = (point: string) => {
    const currentVote = currentUser?.vote;
    const vote = currentVote === point ? undefined : point;
    socket?.emit("vote", { roomId: id, vote });
  };

  const resetVotes = () => socket?.emit("reset", { roomId: id });
  const toggleResults = () => socket?.emit("reveal", { roomId: id });

  return (
    <div className="p-4 flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <RoomSidebar
        currentUser={currentUser}
        participants={participants}
        isRevealed={isRevealed}
        onReset={resetVotes}
        onReveal={toggleResults}
        className="w-full md:w-64 mb-6 md:mb-0 md:mr-8"
      />
      <main className="flex-1 flex flex-col items-center px-2 md:px-0">
        <VoteBoard currentVote={currentUser?.vote} onVote={castVote} />
        <p className="mt-4 text-center text-sm text-muted-foreground max-w-md">
          Select your vote by clicking on one of the cards below. You can change
          your vote anytime you want. Once all players have voted, the results
          will be revealed automatically.
        </p>
      </main>
    </div>
  );
}
