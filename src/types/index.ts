

type Role = 'creator' | 'participant';
type VoteValue = string | number;

export interface Participant {
    name: string;
    role: Role;
    vote?: VoteValue; // optional, as a participant may not have voted yet
}