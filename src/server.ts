import app from "./app";
import { Server, Socket } from 'socket.io';
import http from 'http';
import socketMain from "./socket/socket";
import findUserById, { makeInActive } from "./util/findUser";
import helmet from "helmet";
import { instrument } from "@socket.io/admin-ui";
const PORT = 4000;
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:3000",
    "https://camiru.com",
    "https://admin.socket.io",
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Origin not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
    },
});
instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2a$12$aT17OgQqaKX6lEHNkYTY7Ou.iMG1GVTESRXpUDKjRpjQbamqGPQ..",
    }
});

export let socketIO: Socket = null as any
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
export const connectedUsers: any = []

io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.userId as string;
    socketIO = socket
    socket.id = userId;
    socketMain(socket);
    connectedSockets.set(socket.id, socket);
    const newCU = {
        id: socket.id,
        time: new Date().toISOString(),
        user: socket.user
    }
    if (!connectedUsers.find((cu: any) => cu.id === socket.id)) {
        connectedUsers.push(newCU);
        socket.broadcast.emit('userConnected', socket.id)
    }
    socket.on('disconnect', () => {
        connectedSockets.delete(socket.id);
        connectedUsers.splice(connectedUsers.findIndex((cu: any) => cu.id === socket.id), 1)
        makeInActive(socket.id)
    });
});



const startServer = () => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
