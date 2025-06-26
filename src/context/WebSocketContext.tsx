"use client";
import React, { createContext, useContext, useEffect } from "react";
import socket from "../lib/socket";
import { Socket } from "socket.io-client";

export const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () =>
  useContext(WebSocketContext as React.Context<Socket>);
