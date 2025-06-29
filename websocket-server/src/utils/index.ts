import { Room } from "../types/types";

export const allParticipantsVoted = (room: Room): boolean => {
    return Object.values(room.participants).every(p => p.vote !== undefined);
};