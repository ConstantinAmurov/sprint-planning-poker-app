"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

export default function LobbyPage() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const newRoom = uuidv4();
    router.push(`/room/${newRoom}?name=${encodeURIComponent(name)}`);
  };

  const joinRoom = () => {
    if (!roomId) return;
    router.push(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Planning Poker</h1>
      <input
        className="border rounded p-2 w-full max-w-xs"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <div className="flex flex-col w-full max-w-xs space-y-2">
        <input
          className="border rounded p-2"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <Button onClick={joinRoom} disabled={!name || !roomId}>
          Join Existing Room
        </Button>
        <div className="text-center text-sm text-gray-500">or</div>
        <Button onClick={createRoom} disabled={!name}>
          Create New Room
        </Button>
      </div>
    </div>
  );
}
