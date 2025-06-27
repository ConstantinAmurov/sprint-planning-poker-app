import { useRoomStore } from "@/store/useRoomStore";
import { useSearchParams } from "next/navigation";



export const useCurrentUser = () => {
    const search = useSearchParams();
    const name = search.get("name");

    const participants = useRoomStore((state) => state.participants);

    const currentUser = Object.values(participants).find(
        (participant) => participant.name === name
    );

    return currentUser;

}