import { Server, Socket } from "socket.io";
import { roomDB } from "../db/RoomDB.ts";
import { JoinPayload, ResetPayload, VotePayload } from "../types/types.ts";
import { allParticipantsVoted } from "../utils/index.ts";

export const socketHandler = (socket: Socket, io: Server): void => {
    socket.on('join', ({ roomId, name }: JoinPayload) => {
        socket.join(roomId);
        const updatedRoom = roomDB.addParticipant(roomId, socket.id, name);

        io.to(roomId).emit('participants', updatedRoom.participants);
        io.to(roomId).emit('reveal', updatedRoom.isRevealed);
        console.log(`User ${name} joined room ${roomId}`);
        console.log(`Participants in room ${roomId}:`, updatedRoom.participants);
    });

    socket.on('vote', ({ roomId, vote }: VotePayload) => {
        console.log(`Vote received: ${vote}`);
        let room = roomDB.updateVote(roomId, socket.id, vote);
        if (!room) return;

        io.to(roomId).emit('participants', room.participants);

        if (allParticipantsVoted(room)) {
            room = roomDB.setReveal(roomId, true);
            if (room) {
                io.to(roomId).emit('reveal', true);
                console.log(`All participants in room ${roomId} have voted. Revealing cards.`);
            }
        }
    });

    socket.on('reset', ({ roomId }: ResetPayload) => {
        const room = roomDB.resetRoom(roomId);
        if (!room) return;

        io.to(roomId).emit('participants', room.participants);
        io.to(roomId).emit('reveal', false);
        console.log(`Room ${roomId} has been reset.`);
    });

    socket.on('reveal', ({ roomId }: { roomId: string }) => {
        console.log(`Toggling reveal for room ${roomId}`);
        const room = roomDB.getRoom(roomId);
        if (!room) return;

        const updatedRoom = roomDB.setReveal(roomId, !room.isRevealed);
        if (updatedRoom) {
            io.to(roomId).emit('reveal', updatedRoom.isRevealed);
        }
    });

    socket.on('disconnecting', () => {
        console.log('disconnected', socket.id);

        [...socket.rooms]
            .filter((roomId) => roomId !== socket.id)
            .forEach((roomId) => {
                const updatedRoom = roomDB.removeParticipant(roomId, socket.id);
                if (updatedRoom) {
                    io.to(roomId).emit('participants', updatedRoom.participants);
                } else {
                    console.log(`Room ${roomId} is now empty and has been deleted.`);
                }
            });
    });
};
