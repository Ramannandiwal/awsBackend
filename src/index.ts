import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs'
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


const PORT = parseInt(process.env.PORT || '4000', 10);
app.get('/',(req,res)=>{
    res.send("Hello world ")
})
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', ({ roomId, email }) => {
        console.log(`User ${email} joined room ${roomId}`);
        socket.join(roomId);
    });

    socket.on('offer', ({ offer, roomId }) => {
        console.log(`Offer received for room ${roomId}`);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', ({ answer, roomId }) => {
        console.log(`Answer received for room ${roomId}`);
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ candidate, roomId }) => {
        console.log(`ICE candidate received for room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', { candidate });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, '::', () => {
    console.log(`Signaling server is running on port ${PORT}`);
});