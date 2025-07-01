/* eslint-disable @typescript-eslint/no-unused-vars */
import { Participant, Room, VoteValue } from "../types/types.ts";

class RoomDB {
    private rooms: Record<string, Room> = {};

    getRoom(roomId: string): Room | undefined {
        return this.rooms[roomId];
    }

    addParticipant(roomId: string, socketId: string, name: string): Room {
        const roomExisted = !!this.rooms[roomId];
        const newParticipant: Participant = {
            name,
            role: roomExisted ? 'participant' : 'creator',
            vote: undefined,
        };

        const updatedParticipants = {
            ...(this.rooms[roomId]?.participants || {}),
            [socketId]: newParticipant,
        };

        const updatedRoom: Room = {
            participants: updatedParticipants,
            isRevealed: false,
        };

        this.rooms = { ...this.rooms, [roomId]: updatedRoom };

        return updatedRoom;
    }

    removeParticipant(roomId: string, socketId: string): Room | undefined {
        const room = this.rooms[roomId];
        if (!room) return;

        const { [socketId]: _, ...remainingParticipants } = room.participants;

        if (Object.keys(remainingParticipants).length === 0) {
            const { [roomId]: __, ...newRooms } = this.rooms;
            this.rooms = newRooms;
            return undefined;
        }

        const updatedRoom: Room = { ...room, participants: remainingParticipants };
        this.rooms = { ...this.rooms, [roomId]: updatedRoom };
        return updatedRoom;
    }

    updateVote(roomId: string, socketId: string, vote: VoteValue): Room | undefined {
        const room = this.rooms[roomId];
        if (!room?.participants[socketId]) return;

        const updatedParticipants = {
            ...room.participants,
            [socketId]: { ...room.participants[socketId], vote },
        };

        const updatedRoom = { ...room, participants: updatedParticipants };
        this.rooms = { ...this.rooms, [roomId]: updatedRoom };
        return updatedRoom;
    }

    resetRoom(roomId: string): Room | undefined {
        const room = this.rooms[roomId];
        if (!room) return;

        const updatedParticipants = Object.fromEntries(
            Object.entries(room.participants).map(([id, p]) => [id, { ...p, vote: undefined }])
        );

        const updatedRoom = { ...room, participants: updatedParticipants, isRevealed: false };
        this.rooms = { ...this.rooms, [roomId]: updatedRoom };
        return updatedRoom;
    }

    setReveal(roomId: string, isRevealed: boolean): Room | undefined {
        const room = this.rooms[roomId];
        if (!room) return;

        const updatedRoom = { ...room, isRevealed };
        this.rooms = { ...this.rooms, [roomId]: updatedRoom };
        return updatedRoom;
    }
}

export const roomDB = new RoomDB();
