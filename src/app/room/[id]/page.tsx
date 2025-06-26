"use client";
import { useSearchParams, useParams } from "next/navigation";
import ParticipantList from "../../../components/ParticipantList";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/context/WebSocketContext";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const { id } = useParams();
  const search = useSearchParams();
  const name = search.get("name") || "Anonymous";
  const socket = useWebSocket();

  const [participants, setParticipants] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  // join room and reset reveal
  useEffect(() => {
    if (socket) {
      setRevealed(false);
      socket.emit("join", { roomId: id, name });
    }
  }, [socket]);

  // listen for participants, votes, and reveal events
  useEffect(() => {
    socket?.on("participants", setParticipants);
    socket?.on("votes", (newVotes: Record<string, string>) => {
      setVotes(newVotes);
    });
    socket?.on("reveal", (flag: boolean) => setRevealed(flag));
    return () => {
      socket?.off("participants");
      socket?.off("votes");
      socket?.off("reveal");
    };
  }, [socket, participants]);

  const castVote = (point: string) => {
    setRevealed(false);
    socket?.emit("vote", { roomId: id, vote: point });
  };

  const resetVotes = () => {
    setRevealed(false);
    socket?.emit("reset", { roomId: id });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Room: {id}</h2>
      <ParticipantList
        participants={participants}
        votes={votes}
        reveal={revealed}
      />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {["1", "2", "3", "5", "8", "13", "?"].map((p) => (
          <Card key={p} value={p} onClick={() => castVote(p)} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button onClick={resetVotes} className="bg-red-500 text-white">
          Reset Votes
        </Button>
      </div>
    </div>
  );
}
