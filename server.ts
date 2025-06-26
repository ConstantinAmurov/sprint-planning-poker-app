import { createServer } from 'node:http';
import next from 'next';
import { Server as IOServer, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

interface RoomState {
    participants: Record<string, string>;
    votes: Record<string, string>;
}
const rooms: Record<string, RoomState> = {};

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        void handler(req, res);
    });

    const io = new IOServer(httpServer, { cors: { origin: '*' } });

    io.on('connection', (socket: Socket) => {
        socket.on('join', ({ roomId, name }) => {
            socket.join(roomId);
            rooms[roomId] ||= { participants: {}, votes: {} };
            rooms[roomId].participants[socket.id] = name;
            rooms[roomId].votes = rooms[roomId].votes || {};
            io.to(roomId).emit('participants', rooms[roomId].participants);
            io.to(roomId).emit('votes', rooms[roomId].votes);
            // ensure reveal false on join
            io.to(roomId).emit('reveal', false);
        });

        socket.on('vote', ({ roomId, vote }) => {
            console.log(`Vote received: ${vote}`);
            if (!rooms[roomId]) return;
            rooms[roomId].votes[socket.id] = vote;
            io.to(roomId).emit('votes', rooms[roomId].votes);

            console.log(rooms[roomId].votes)
            if (Object.keys(rooms[roomId].votes).length ===
                Object.keys(rooms[roomId].participants).length) {
                io.to(roomId).emit('reveal', true);
            }
        });

        socket.on('reset', ({ roomId }) => {
            if (!rooms[roomId]) return;
            rooms[roomId].votes = {};
            io.to(roomId).emit('votes', rooms[roomId].votes);
            io.to(roomId).emit('reveal', false);
        });

        socket.on('disconnecting', () => {
            for (const roomId of socket.rooms) {
                if (rooms[roomId]) {
                    delete rooms[roomId].participants[socket.id];
                    delete rooms[roomId].votes[socket.id];
                    io.to(roomId).emit('participants', rooms[roomId].participants);
                    io.to(roomId).emit('votes', rooms[roomId].votes);
                }
            }
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});