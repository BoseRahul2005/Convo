import { io } from "socket.io-client"

//function to connect to the socket 
const connectSocket = (userId) => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
    return io(SOCKET_URL, { query: { userId }, withCredentials: true });
}

export default connectSocket;