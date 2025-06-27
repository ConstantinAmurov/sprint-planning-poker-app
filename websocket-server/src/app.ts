import { Server, Socket } from "socket.io";
import { socketHandler } from './sockets/index.ts';

const PORT = 3005;

console.log(`WebSocket server is running on port ${PORT}`);
const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket: Socket) => {
    socketHandler(socket, io);
});

io.listen(PORT);

