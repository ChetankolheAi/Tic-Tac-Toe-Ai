import { io } from "socket.io-client";

const URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : import.meta.env.VITE_BACKEND; 

export const socket = io(URL);