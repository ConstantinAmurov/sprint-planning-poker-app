import { create } from 'zustand'
import { Participant } from "@/types";

export interface RoomState {
    participants: Record<string, Participant>;
    isRevealed: boolean;
    setParticipants: (p: Record<string, Participant>) => void;
    setIsRevealed: (isRevealed: boolean) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    participants: {},
    setParticipants: (participants) => set({ participants }),
    isRevealed: false,
    setIsRevealed: (isRevealed) => set({ isRevealed }),
}));