import { useState, createContext, useEffect } from "react"
import { Sports } from "../constants/Sports";
const SPORT_KEY: string = "sport"
const DEFAULT_SPORT = { sportId: 1, sportName: "Baseball", count: 0, sportLogo: "" };
export const SportContext = createContext<{
    sport: Sports | null,
    changeSport: (sport: Sports | null) => void
}>({
    sport: null,
    changeSport: () => {}
});
const SportProvider = (props: { children: any }) => {
    let [sport, setSport] = useState<Sports | null>(null);
    useEffect(() => {
        const getSport = async () => {
            const sport = localStorage.getItem(SPORT_KEY);
            if (sport) {
                changeSport(JSON.parse(sport));
            } else {
                changeSport(DEFAULT_SPORT)
            }
        }
        getSport()
    }, [])

    function changeSport(sport: Sports | null) {
        setSport(sport);
        localStorage.setItem(SPORT_KEY, sport ? JSON.stringify(sport) : "");
    }

    return (
        <SportContext.Provider value={{ sport, changeSport }}>
            {props.children}
        </SportContext.Provider>
    )
}
export default SportProvider