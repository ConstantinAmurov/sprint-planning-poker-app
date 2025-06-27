const rooms = {};
export const socketHandler = (socket, io) => {
    socket.on('join', ({ roomId, name }) => {
        var _a;
        socket.join(roomId);
        const existingRoom = !!rooms[roomId];
        rooms[roomId] || (rooms[roomId] = { participants: {}, votes: {} });
        rooms[roomId].participants[socket.id] = {
            name,
            role: existingRoom ? 'participant' : 'creator',
        };
        (_a = rooms[roomId]).votes || (_a.votes = {});
        io.to(roomId).emit('participants', rooms[roomId].participants);
        io.to(roomId).emit('votes', rooms[roomId].votes);
        io.to(roomId).emit('reveal', false);
    });
    socket.on('vote', ({ roomId, vote }) => {
        console.log(`Vote received: ${vote}`);
        if (!rooms[roomId])
            return;
        rooms[roomId].votes[socket.id] = vote;
        io.to(roomId).emit('votes', rooms[roomId].votes);
        if (Object.keys(rooms[roomId].votes).length ===
            Object.keys(rooms[roomId].participants).length) {
            io.to(roomId).emit('reveal', true);
        }
    });
    socket.on('reset', ({ roomId }) => {
        if (!rooms[roomId])
            return;
        rooms[roomId].votes = {};
        io.to(roomId).emit('votes', rooms[roomId].votes);
        io.to(roomId).emit('reveal', false);
    });
    socket.on('disconnecting', () => {
        console.log('disconnected', socket.id);
        for (const roomId of socket.rooms) {
            if (rooms[roomId]) {
                delete rooms[roomId].participants[socket.id];
                delete rooms[roomId].votes[socket.id];
                if (Object.keys(rooms[roomId].participants).length === 0) {
                    console.log(`Deleting room ${roomId} due to no participants`);
                    delete rooms[roomId];
                }
                else {
                    console.log(`Updating room ${roomId} participants`);
                    io.to(roomId).emit('participants', rooms[roomId].participants);
                    io.to(roomId).emit('votes', rooms[roomId].votes);
                }
            }
        }
    });
};
