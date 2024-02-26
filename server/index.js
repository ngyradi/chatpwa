"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const port = 3000;
const httpServer = (0, http_1.createServer)();
let rooms;
rooms = [];
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
    }
});
io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('join', (data) => {
        socket.emit('joined');
    });
    socket.on('new message', (data) => {
        let msg = socket.id + ": " + data;
        console.log(`${socket.id}: ${data}`);
        io.emit('new message', msg);
    });
    socket.on('create room', (data) => {
        rooms.push({ name: data.name, password: data.password });
        console.log(`create room ${data.name}`);
        io.emit('new room', data);
    });
    socket.on('view rooms', () => {
        socket.emit('all rooms', rooms);
    });
});
httpServer.listen(port);
console.log(`Listening on port ${port}`);
