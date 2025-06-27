

export type Role = 'creator' | 'participant';
export type VoteValue = string | number;

export interface Participant {
    name: string;
    role: Role;
    vote?: VoteValue; // optional, as a participant may not have voted yet
}