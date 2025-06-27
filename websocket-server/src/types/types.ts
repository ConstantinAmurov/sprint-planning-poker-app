
type Role = 'creator' | 'participant';
type VoteValue = string | number; // adjust based on what a vote can be

interface Participant {
    name: string;
    role: Role;
    vote?: VoteValue; // optional, as a participant may not have voted yet
}


export interface Room {
    participants: Record<string, Participant>; // socket.id -> participant
    isRevealed?: boolean; // optional, to track if votes are revealed
}



export interface VotePayload {
    roomId: string;
    vote: VoteValue;
}

export interface ResetPayload {
    roomId: string;


}

export interface JoinPayload {
    roomId: string;
    name: string;
}