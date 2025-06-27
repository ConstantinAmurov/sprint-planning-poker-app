const rooms = {};


export const socketHandler = (socket, io) => {
    socket.on('join', ({ roomId, name }) => {
        socket.join(roomId);
        const existingRoom = !!rooms[roomId];
        rooms[roomId] ||= { participants: {}, votes: {} };
        rooms[roomId].participants[socket.id] = {
            name,
            role: !existingRoom ? 'creator' : 'participant'
        };
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
        console.log('disconnected', socket.id);
        for (const roomId of socket.rooms) {
            if (rooms[roomId]) {
                delete rooms[roomId].participants[socket.id];
                delete rooms[roomId].votes[socket.id];

                if (rooms[roomId] && Object.keys(rooms[roomId].participants).length === 0) {
                    console.log(`Deleting room ${roomId} due to no participants`, rooms[roomId]);
                    delete rooms[roomId];
                }
                else {
                    console.log(`Updating room ${roomId} participants`, rooms[roomId]);
                    io.to(roomId).emit('participants', rooms[roomId].participants);
                    io.to(roomId).emit('votes', rooms[roomId].votes);
                }
            }
        }
    });
}