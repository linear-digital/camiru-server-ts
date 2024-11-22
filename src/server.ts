import app from "./app";
import { Server, Socket } from 'socket.io';
import http from 'http';
import socketMain from "./socket/socket";
import Center from "./modules/center/center.model";
import mongoose from "mongoose";
import findUserById from "./util/findUser";
import helmet from "helmet";

const PORT = 4000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

io.use(async (socket: any, next) => {
    const userId = socket.handshake.query.userId as string;
    if (!userId) {
        return next(new Error('Authentication error'));
    }

    try {
        const user = await findUserById(userId);

        if (!user) {
            return next(new Error('User not found'));
        }
        socket.user = user
        socket.id = userId
        next();
    } catch (error) {
        next(new Error('Internal server error'));
    }
});

io.engine.use(helmet());

export const connectedSockets = new Map();
export const connectedUsers = new Map();

io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.userId as string;
    console.log(userId);
    socket.id = userId;
    socketMain(socket);
    connectedSockets.set(socket.id, socket);   
    connectedUsers.set(socket.id, socket.user);   

    socket.on('disconnect', () => {
        connectedSockets.delete(socket.id);
    });
});



const startServer = () => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
