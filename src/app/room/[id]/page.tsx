"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import ParticipantList from "../../../components/ParticipantList";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketProvider";
import { Participant } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RoomPage() {
  const { id } = useParams();
  const search = useSearchParams();
  const name = search.get("name");
  const socket = useSocket();
  const router = useRouter();

  const [participants, setParticipants] = useState<Record<string, Participant>>(
    {}
  );
  // join room and reset reveal
  useEffect(() => {
    if (!name) {
      router.push(`/?session=${id}`);
    }
    if (socket) {
      socket.emit("join", { roomId: id, name });
    }
  }, [id, name, router, socket]);

  useEffect(() => {
    socket?.on("participants", setParticipants);
    return () => {
      socket?.off("participants");
    };
  }, [socket, participants]);

  const castVote = (point: string) => {
    socket?.emit("vote", { roomId: id, vote: point });
  };

  const resetVotes = () => {
    socket?.emit("reset", { roomId: id });
  };

  console.log("Participants:", participants);
  return (
    <div className="p-4 flex flex-row min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-lg shadow-md p-4 mr-8 flex-shrink-0 h-fit">
        <div className="flex flex-row gap-2 mb-4 items-center">
          <Switch /> <h3>I am moderator!</h3>
        </div>
        <div className="flex flex-row gap-4 mb-6">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">{name}</h4>
            <p className="text-xs text-gray-500">User Status</p>
          </div>
        </div>
        <h2 className="text-md text-gray-500 mb-1">Players:</h2>
        <ParticipantList participants={participants} />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4 w-xl bg-neutral-200 p-4 rounded-lg shadow-md">
          {["1", "2", "3", "5", "8", "13", "?"].map((p) => (
            <Card key={p} value={p} onClick={() => castVote(p)} />
          ))}
        </div>
        <Button className="mt-6" onClick={resetVotes}>
          Reset Votes
        </Button>
      </main>
    </div>
  );
}
