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
    //join room
    socket.on('join', (data) => {
        socket.emit('joined');
    });
    //receive message
    socket.on('new message', (data) => {
        //let msg = socket.id + ": "  + data;
        console.log(`${socket.id}: ${data}`);
        let msg = { username: socket.id, message: data };
        io.emit('new message', msg);
    });
});
httpServer.listen(port);
console.log(`Listening on port ${port}`);
