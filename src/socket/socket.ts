import { Socket } from "socket.io";
import messageHandler from "./message";


const socketMain = (socket: Socket) => {
    // Listen for signaling data from clients
    // Handle signaling data
    socket.on("offer", (data) => {
        socket.to(data.target).emit("offer", data);
    });

    socket.on("answer", (data) => {
        socket.to(data.target).emit("answer", data);
    });

    socket.on("candidate", (data) => {
        socket.to(data.target).emit("candidate", data);
    });

    // message handler 
    messageHandler(socket)
}

export default socketMain