"use client";
import { Socket } from "socket.io-client";
import { RoomState } from "@/store/useRoomStore";


export const setupSocketEventListeners = (
  socket: Socket,
  store: Omit<RoomState, 'participants' | 'isRevealed'>
) => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("participants", (data) => {
    console.log("Received participants in provider:", data);
    store.setParticipants(data);
  });

  socket.on("reveal", (isRevealed) => {
    console.log("Received reveal status in provider:", isRevealed);
    store.setIsRevealed(isRevealed);
  });

  return () => {
    socket.off("connect");
    socket.off("participants");
    socket.off("reveal");
    socket.disconnect()
  };
};