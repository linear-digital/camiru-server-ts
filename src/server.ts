import app from "./app";
import { Server, Socket } from 'socket.io';
import http from 'http';
import { Request, Response } from 'express';

const PORT = 4000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
});
io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.userId as string;
    socket.id = userId;

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });

    // Custom event: chat message
    socket.on('chat message', (msg: string) => {
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });
});



const startServer = () => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();