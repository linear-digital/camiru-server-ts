import { Socket } from "socket.io"
import jwt  from 'jsonwebtoken';
import { connectedSockets } from "../server";
const callSocket = (socket: Socket) => {
    // Handle signaling data
    socket.on("offer", (data) => {
        // socket.emit("offer", data);
        const decodeToken = jwt.decode(data.token)
        socket.emit('on-going', data)
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
}

export default callSocket