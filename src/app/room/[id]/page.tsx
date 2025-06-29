"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!name) {
      router.push(`/?session=${id}`);
      return;
    }
    socket?.emit("join", { roomId: id, name });
  }, [id, name, socket, router]);

  const castVote = (point: string) => {
    const currentVote = currentUser?.vote;
    const vote = currentVote === point ? undefined : point;
    socket?.emit("vote", { roomId: id, vote });
  };

  const resetVotes = () => socket?.emit("reset", { roomId: id });
  const toggleResults = () => socket?.emit("reveal", { roomId: id });

  return (
    <div className="p-4 flex flex-row min-h-screen bg-background text-foreground">
      <RoomSidebar
        currentUser={currentUser}
        participants={participants}
        isRevealed={isRevealed}
        onReset={resetVotes}
        onReveal={toggleResults}
      />
      <main className="flex-1 flex flex-col items-center">
        <VoteBoard currentVote={currentUser?.vote} onVote={castVote} />
      </main>
    </div>
  );
}
