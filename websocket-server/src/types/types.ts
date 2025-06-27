
type Role = 'creator' | 'participant';

interface Participant {
    name: string;
    role: Role;
}

type VoteValue = string | number; // adjust based on what a vote can be

export interface Room {
    participants: Record<string, Participant>; // socket.id -> participant
    votes: Record<string, VoteValue>;          // socket.id -> vote
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