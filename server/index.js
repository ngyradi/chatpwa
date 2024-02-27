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
    let connectedRoomId;
    socket.on('disconnect', () => {
        if (connectedRoomId !== undefined) {
            if (rooms[connectedRoomId]) {
                rooms[connectedRoomId].numPeople--;
                io.emit('all rooms', getRoomView(rooms));
                console.log(`${socket.id} disconnected from room: ${connectedRoomId}`);
            }
        }
    });
    //chat
    //join room
    socket.on('join', (data) => {
        console.log(`${socket.id} tried to join: ${data.id}`);
        if (data.id !== undefined && data.id !== connectedRoomId) {
            if (rooms[data.id].public) {
                rooms[data.id].numPeople++;
                let joinedRoom = rooms[data.id];
                joinedRoom.id = data.id;
                socket.emit('joined', joinedRoom);
                connectedRoomId = data.id;
                console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`);
                io.emit('all rooms', getRoomView(rooms));
            }
        }
    });
    //leave room
    socket.on('leave', (data) => {
        if (data.id !== undefined) {
            rooms[data.id].numPeople--;
        }
    });
    //receive message
    socket.on('new message', (data) => {
        console.log(`${socket.id}: ${data}`);
        let msg = { username: socket.id, message: data };
        io.emit('new message', msg);
    });
    //rooms
    //fetch rooms
    socket.on('get rooms', () => {
        console.log(`${socket.id} asked for rooms`);
        socket.emit('all rooms', getRoomView(rooms));
    });
    //create new room
    socket.on('new room', (data) => {
        let visiblity = true;
        if (data.password) {
            visiblity = false;
        }
        //TODO check if room with same name already exists
        rooms.push({ name: data.name, password: data.password, numPeople: 0, public: visiblity });
        console.log(`added new room: ${data.name} ${data.password}`);
        io.emit('new room');
    });
});
httpServer.listen(port);
console.log(`Listening on port ${port}`);
function getRoomView(_rooms) {
    return _rooms.map((r, index) => ({ id: index, name: r.name, numPeople: r.numPeople, public: r.public }));
}
