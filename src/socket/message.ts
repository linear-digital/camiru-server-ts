import { Socket } from "socket.io";
import { connectedSockets } from "../server";
import messageService from "../modules/message/message.service";
import Message from "../modules/message/message.model";

export const sendMessageToSpecificUser = async (socketId: string, message: any) => {
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
    io.on('seen', async (data: any) => {

        const result = await Message.updateMany({
            receiver: data.receiver,
            sender: data.sender,
            seen: false
        }, {
            seen: true
        })
        if (connectedSockets.has(data.sender) && result.modifiedCount > 0) {
            const socket2 = connectedSockets.get(data.sender);
            socket2.emit("seen", Math.floor(Date.now() / 1000));
        }
    })
}

export default messageHandler