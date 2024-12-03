import jwt  from 'jsonwebtoken';
import { Socket } from "socket.io";
import messageHandler, { sendMessageToSpecificUser } from "./message";
import { connectedSockets } from "../server";

const socketMain = (socket: Socket) => {
    // Listen for signaling data from clients
    // Handle signaling data
    socket.on("offer", (data) => {
        // socket.emit("offer", data);
        const decodeToken = jwt.decode(data.token)

        if (connectedSockets.has(data.target)) {
            const socket2 = connectedSockets.get(data.target);
            socket2.emit("offer", {
                name: decodeToken?.sub,
                room: data.room,
                target: data.target,
                profilePic: data.profilePic
            });
        }
    });

    socket.on("answer", (data) => {
        socket.to(data.target).emit("answer", data);
    });

    socket.on("end", (data) => {
        if (connectedSockets.has(data.target)) {
            const socket2 = connectedSockets.get(data.target);
            socket2.emit("end", data);
        }
    });

    // message handler 
    messageHandler(socket)
}

export default socketMain