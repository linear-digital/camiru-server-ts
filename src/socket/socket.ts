import { Socket } from "socket.io";
import { connectedSockets } from "../server";


const socketMain = (socket: Socket) => {
    socket.on('message', (data: any) => {
        //    socket.broadcast.emit('message', socket.user)
        if (connectedSockets.has(data)) {
            const socket2 = connectedSockets.get(data);
            socket2.emit("message", data);
        } else {
            console.log(`Socket with ID ${data} not found.`);
        }
    })

    socket.on('disconnect', () => {
        console.log('Disconnected', socket.id)
    })
}

export default socketMain