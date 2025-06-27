// socket/handlers.ts
import { Socket, Server } from 'socket.io';
import {
    ensureRoom, addParticipant, removeParticipant,
    addVote, resetVotes, getRoom, deleteRoom
} from '@/../db/rooms';

export function registerSocketHandlers(io: Server, socket: Socket) {
    console.log('Socket connected:', socket.id);
    socket.on('join', ({ roomId, name }) => {
        console.log('On Join')
        socket.join(roomId);
        const roomExists = !!getRoom(roomId);

        addParticipant(roomId, socket.id, {
            name,
            role: roomExists ? 'participant' : 'creator'
        });

        const room = ensureRoom(roomId);
        io.to(roomId).emit('participants', room.participants);
        io.to(roomId).emit('votes', room.votes);
        io.to(roomId).emit('reveal', false);
    });

    socket.on('vote', ({ roomId, vote }) => {
        const room = getRoom(roomId);
        if (!room) return;

        addVote(roomId, socket.id, vote);
        io.to(roomId).emit('votes', room.votes);

        if (Object.keys(room.votes).length === Object.keys(room.participants).length) {
            io.to(roomId).emit('reveal', true);
        }
    });

    socket.on('reset', ({ roomId }) => {
        resetVotes(roomId);
        const room = getRoom(roomId);
        if (room) {
            io.to(roomId).emit('votes', room.votes);
            io.to(roomId).emit('reveal', false);
        }
    });

    socket.on('disconnecting', () => {
        for (const roomId of socket.rooms) {
            const room = getRoom(roomId);
            if (!room) continue;

            removeParticipant(roomId, socket.id);
            if (Object.keys(room.participants).length === 0) {
                deleteRoom(roomId);
            } else {
                io.to(roomId).emit('participants', room.participants);
                io.to(roomId).emit('votes', room.votes);
            }
        }
    });
}
