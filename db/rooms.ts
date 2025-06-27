import type { Participant, RoomState } from '@/types/types';

const rooms: Record<string, RoomState> = {};

export function getRoom(roomId: string): RoomState | undefined {
    return rooms[roomId];
}

export function ensureRoom(roomId: string): RoomState {
    if (!rooms[roomId]) {
        rooms[roomId] = { participants: {}, votes: {} };
    }
    return rooms[roomId];
}

export function deleteRoom(roomId: string) {
    delete rooms[roomId];
}

export function addParticipant(roomId: string, socketId: string, participant: Participant) {
    ensureRoom(roomId).participants[socketId] = participant;
}

export function removeParticipant(roomId: string, socketId: string) {
    const room = getRoom(roomId);
    if (room) {
        delete room.participants[socketId];
        delete room.votes[socketId];
    }
}

export function addVote(roomId: string, socketId: string, vote: string) {
    ensureRoom(roomId).votes[socketId] = vote;
}

export function resetVotes(roomId: string) {
    const room = getRoom(roomId);
    if (room) room.votes = {};
}

export function getAllRooms() {
    return rooms;
}
