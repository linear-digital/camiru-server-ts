import { Socket } from "socket.io";
import { connectedSockets } from "../server";
import messageService from "../modules/message/message.service";

export const sendMessageToSpecificUser = (socketId: string, message: any) => {
    if (connectedSockets.has(socketId)) {
        const socket2 = connectedSockets.get(socketId);
        socket2.emit("message", message);
    }
}

const messageHandler = async (io: Socket) => {
    io.on('message', async (data: any) => {
        //    socket.broadcast.emit('message', socket.user)
        // sendMessageToSpecificUser(data, data)

        const result = await messageService.createMessage(data)
        sendMessageToSpecificUser(data.receiver, result)
        io.emit('message', result)
        // console.log(data);   
    })

}

export default messageHandler