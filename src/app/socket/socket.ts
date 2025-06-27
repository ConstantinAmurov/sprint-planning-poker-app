// socket/index.ts
import { Server as IOServer } from 'socket.io';
import { registerSocketHandlers } from './handlers';
import { Server, IncomingMessage, ServerResponse } from 'http';

export function setupSocket(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    const io = new IOServer(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        registerSocketHandlers(io, socket);
    });
}
