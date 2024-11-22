import { Socket } from "socket.io";
import messageHandler from "./message";


const socketMain = (socket: Socket) => {
   
    // message handler 
    messageHandler(socket)
}

export default socketMain