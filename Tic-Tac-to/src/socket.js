import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000");
export const socket = io(import.meta.env.VITE_BACKEND);