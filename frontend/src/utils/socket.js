import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://iot-dashboard-v5ab.onrender.com"; // or from env

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
