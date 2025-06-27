export type Participant = { name: string; role: 'creator' | 'participant' }
export interface RoomState {
    participants: Record<string, Participant>;
    votes: Record<string, string>;
}