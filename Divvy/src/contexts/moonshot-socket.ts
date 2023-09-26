import {io} from "socket.io-client";
import {createContext} from "react";

export const socket = io("https://moonshot.divvy.bet");
export const MoonshotSocketContext = createContext(socket);
