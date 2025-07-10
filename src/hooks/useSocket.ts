import { SocketContext } from "@/context/SocketProvider";
import { useContext } from "react";
import { Socket } from "socket.io-client";


export const useSocket = (): Socket | null => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context.socket;
};