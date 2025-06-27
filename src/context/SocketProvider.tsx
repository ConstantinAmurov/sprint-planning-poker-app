"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRoomStore } from "@/store/useRoomStore"; // import your Zustand store

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Get Zustand setter function
  const setParticipants = useRoomStore((state) => state.setParticipants);
  const setIsRevealed = useRoomStore((state) => state.setIsRevealed);

  useEffect(() => {
    const socketInstance = io("http://localhost:3005");
    setSocket(socketInstance);

    // On connection established
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);

      // Example: After connecting, server might send initial participants event
      // Listen for it here and update Zustand store
      socketInstance.on("participants", (data) => {
        console.log("Received participants in provider:", data);
        setParticipants(data);
      });

      socketInstance.on("reveal", (isRevealed) => {
        console.log("Received reveal status in provider:", isRevealed);
        setIsRevealed(isRevealed);
      });

      // Optionally, emit join or initial request here if needed
      // socketInstance.emit("join", { roomId: "some-room-id", name: "some-name" });
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off("participants");
      socketInstance.off("connect");
      socketInstance.disconnect();
    };
  }, [setParticipants]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
