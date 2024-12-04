
import { Socket } from "socket.io";
import messageHandler, { sendMessageToSpecificUser } from "./message";
import { connectedSockets } from "../server";
import callSocket from "./call";

const socketMain = (socket: Socket) => {
    // Listen for signaling data from clients

    callSocket(socket)
    // message handler 
    messageHandler(socket)
}

export default socketMain