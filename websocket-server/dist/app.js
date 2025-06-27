import { Server } from "socket.io";
import { socketHandler } from './sockets/index';
const PORT = 3005;
const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    socketHandler(socket, io);
});
io.listen(PORT);
