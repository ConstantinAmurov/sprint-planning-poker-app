"use client";
import { useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import ParticipantList from "../../../components/ParticipantList";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketProvider";
import { useRoomStore } from "@/store/useRoomStore"; // import Zustand store
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function RoomPage() {
  const { id } = useParams();
  const search = useSearchParams();
  const name = search.get("name");
  const currentUser = useCurrentUser();
  const { isRevealed } = useRoomStore();

  console.log({ isRevealed });
  const socket = useSocket();
  const router = useRouter();
  const participants = useRoomStore((state) => state.participants);

  useEffect(() => {
    if (!name) {
      router.push(`/?session=${id}`);
      return;
    }
    if (socket) {
      socket.emit("join", { roomId: id, name });
    }
  }, [id, name, router, socket]);

  const castVote = (point: string) => {
    if (currentUser?.vote === point) {
      // If the user clicks on the same point, reset their vote
      socket?.emit("vote", { roomId: id, vote: undefined });
    } else {
      socket?.emit("vote", { roomId: id, vote: point });
    }
  };

  const resetVotes = () => {
    socket?.emit("reset", { roomId: id });
  };

  const toggleResults = () => {
    socket?.emit("reveal", { roomId: id });
  };

  return (
    <div className="p-4 flex flex-row min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-lg shadow-md p-4 mr-8 flex-shrink-0 h-100%">
        <div className="flex flex-row gap-4 mb-6">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>

          <div>
            <h4 className="text-sm font-semibold">{currentUser?.name}</h4>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>
        </div>
        {currentUser?.role === "creator" && (
          <div className="flex gap-3 justify-center">
            <Button className="text-xs" onClick={resetVotes}>
              Clear votes
            </Button>
            <Button className="text-xs" onClick={toggleResults}>
              Show results
            </Button>
          </div>
        )}
        <h2 className="text-md text-gray-500 mb-1 mt-6">Players:</h2>
        <ParticipantList participants={participants} revealVotes={isRevealed} />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4 w-xl bg-neutral-200 p-4 rounded-lg shadow-md">
          {["1", "2", "3", "5", "8", "13"].map((p) => (
            <Card
              key={p}
              value={p}
              onClick={() => castVote(p)}
              className={
                currentUser?.vote === p
                  ? "ring-4 ring-blue-500 border-blue-500"
                  : ""
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
