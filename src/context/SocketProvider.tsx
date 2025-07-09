"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useRoomStore } from "@/store/useRoomStore";
import { setupSocketEventListeners } from "@/lib/socket/handlers";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketValue = useMemo(() => ({ socket }), [socket]);

  const { setParticipants, setIsRevealed } = useRoomStore();

  useEffect(() => {
    const socketInstance = io("http://localhost:3005");
    setSocket(socketInstance);

    const cleanupListeners = setupSocketEventListeners(socketInstance, {
      setParticipants,
      setIsRevealed,
    });

    return () => {
      cleanupListeners();
    };
  }, [setParticipants, setIsRevealed]);

  return (
    <SocketContext.Provider value={socketValue}>
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
