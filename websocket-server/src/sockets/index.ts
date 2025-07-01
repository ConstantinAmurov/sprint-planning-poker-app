/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, Socket } from "socket.io";
import { JoinPayload, Participant, ResetPayload, Room, VotePayload } from "../types/types.ts";
import { allParticipantsVoted } from "../utils/index.ts";
let rooms: Record<string, Room> = {};


export const socketHandler = (socket: Socket, io: Server): void => {
    socket.on('join', ({ roomId, name }: JoinPayload) => {
        socket.join(roomId);

        const currentRoom = rooms[roomId];

        if (currentRoom?.participants[socket.id]) {
            console.log(`User ${name} already exists in room ${roomId}`);
            return;
        }

        const newParticipant: Participant = {
            name,
            role: currentRoom ? 'participant' : 'creator',
            vote: undefined,
        };

        const updatedParticipants = {
            ...(currentRoom?.participants || {}),
            [socket.id]: newParticipant,
        };

        const updatedRoom: Room = {
            ...currentRoom,
            participants: updatedParticipants,
            isRevealed: false,
        };

        rooms = {
            ...rooms,
            [roomId]: updatedRoom,
        };

        io.to(roomId).emit('participants', rooms[roomId].participants);
        io.to(roomId).emit('reveal', rooms[roomId].isRevealed);
        console.log(`User ${name} joined room ${roomId}`);
        console.log(`Participants in room ${roomId}:`, rooms[roomId].participants);

    });

    socket.on('vote', ({ roomId, vote }: VotePayload) => {
        console.log(`Vote received: ${vote}`);
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        const updatedParticipant = {
            ...currentRoom.participants[socket.id],
            vote,
        };

        const updatedParticipants = {
            ...currentRoom.participants,
            [socket.id]: updatedParticipant,
        };

        const roomWithVote: Room = {
            ...currentRoom,
            participants: updatedParticipants,
        };

        const shouldReveal = allParticipantsVoted(roomWithVote);
        const finalRoom = shouldReveal ? { ...roomWithVote, isRevealed: true } : roomWithVote;

        rooms = {
            ...rooms,
            [roomId]: finalRoom,
        };

        io.to(roomId).emit('participants', rooms[roomId].participants);

        if (shouldReveal) {
            io.to(roomId).emit('reveal', true);
            console.log(`All participants in room ${roomId} have voted. Revealing cards.`);
        }
    });

    socket.on('reset', ({ roomId }: ResetPayload) => {
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        const updatedParticipants = Object.fromEntries(
            Object.entries(currentRoom.participants).map(([id, participant]) => [
                id,
                { ...participant, vote: undefined },
            ])
        );

        const updatedRoom: Room = {
            ...currentRoom,
            participants: updatedParticipants,
            isRevealed: false,
        };

        rooms = {
            ...rooms,
            [roomId]: updatedRoom,
        };

        io.to(roomId).emit('participants', rooms[roomId].participants);
        io.to(roomId).emit('reveal', false);

        console.log(`Room ${roomId} has been reset.`);
    });


    socket.on('reveal', ({ roomId }: { roomId: string }) => {

        console.log(rooms)
        console.log(`Toggling reveal for room ${roomId}`);
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        const updatedRoom = {
            ...currentRoom,
            isRevealed: !currentRoom.isRevealed,
        };

        rooms = {
            ...rooms,
            [roomId]: updatedRoom,
        };

        io.to(roomId).emit('reveal', rooms[roomId].isRevealed);
    });

    socket.on('disconnecting', () => {
        console.log('disconnected', socket.id);

        rooms = Array.from(socket.rooms).reduce((currentRooms, roomId) => {
            const room = currentRooms[roomId];
            if (!room) {
                return currentRooms;
            }

            const { [socket.id]: _deleted, ...remainingParticipants } = room.participants;

            if (Object.keys(remainingParticipants).length === 0) {
                console.log(`Deleting room ${roomId} due to no participants`);
                const { [roomId]: _deletedRoom, ...nextRooms } = currentRooms;
                return nextRooms;
            }

            console.log(`Updating room ${roomId} participants`);
            const updatedRoom: Room = {
                ...room,
                participants: remainingParticipants,
            };
            io.to(roomId).emit('participants', updatedRoom.participants);

            return {
                ...currentRooms,
                [roomId]: updatedRoom,
            };
        }, rooms);
    });
};
