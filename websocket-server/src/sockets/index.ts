import { Server, Socket } from "socket.io";
import { JoinPayload, ResetPayload, Room, VotePayload } from "../types/types.ts";
const rooms: Record<string, Room> = {};


export const socketHandler = (socket: Socket, io: Server): void => {
    socket.on('join', ({ roomId, name }: JoinPayload) => {
        socket.join(roomId);

        const existingRoom = !!rooms[roomId];
        rooms[roomId] ||= { participants: {} };
        rooms[roomId].participants[socket.id] = {
            name,
            role: existingRoom ? 'participant' : 'creator',
            vote: undefined
        };
        rooms[roomId].isRevealed = false;

        io.to(roomId).emit('participants', rooms[roomId].participants);
        io.to(roomId).emit('reveal', rooms[roomId].isRevealed);
    });

    socket.on('vote', ({ roomId, vote }: VotePayload) => {
        console.log(`Vote received: ${vote}`);
        if (!rooms[roomId]) return;

        rooms[roomId].participants[socket.id].vote = vote;
        io.to(roomId).emit('participants', rooms[roomId].participants);

    });

    socket.on('reset', ({ roomId }: ResetPayload) => {
        if (!rooms[roomId]) return;

        rooms[roomId].participants[socket.id].vote = undefined;
        io.to(roomId).emit('participants', rooms[roomId].participants);
        io.to(roomId).emit('reveal', false);
    });


    socket.on('reveal', ({ roomId }: { roomId: string }) => {

        console.log(rooms)
        console.log(`Toggling reveal for room ${roomId}`);
        if (!rooms[roomId]) return;
        rooms[roomId].isRevealed = !rooms[roomId].isRevealed;
        io.to(roomId).emit('reveal', rooms[roomId].isRevealed);
    });

    socket.on('disconnecting', () => {
        console.log('disconnected', socket.id);

        for (const roomId of socket.rooms) {
            if (rooms[roomId]) {
                delete rooms[roomId].participants[socket.id];
                if (Object.keys(rooms[roomId].participants).length === 0) {
                    console.log(`Deleting room ${roomId} due to no participants`);
                    delete rooms[roomId];
                } else {
                    console.log(`Updating room ${roomId} participants`);
                    io.to(roomId).emit('participants', rooms[roomId].participants);
                }
            }
        }
    });
};
