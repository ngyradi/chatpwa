"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const port = 3000;
const httpServer = (0, http_1.createServer)();
let rooms = [];
let users = new Map();
let joinCodes = [];
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
    }
});
io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    let connectedRoomId = -1;
    //join online users
    socket.on('join', (data) => {
        users.set(socket.id, { socketId: socket.id, username: data.username });
        console.log(`${data.username} joined`);
        const usernames = [...users.values()];
        io.emit('all users', usernames);
    });
    socket.on('get users', () => {
        console.log(`${socket.id} asked for online users`);
        socket.emit('all users', getUsers(users));
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
        users.delete(socket.id);
        if (connectedRoomId !== -1) {
            if (rooms[connectedRoomId]) {
                rooms[connectedRoomId].numPeople--;
                io.emit('all rooms', getRoomView(rooms));
            }
        }
        io.emit('all users', getUsers(users));
    });
    //chat
    //join room
    socket.on('join room', (data) => {
        console.log(`${socket.id} tried to join: ${data.id}`);
        if (data.id !== undefined && data.id !== connectedRoomId) {
            if (connectedRoomId !== -1) {
                socket.leave(connectedRoomId.toString());
                rooms[connectedRoomId].numPeople--;
                connectedRoomId = -1;
            }
            if (!rooms[data.id].hasPassword || (rooms[data.id].password === data.password)) {
                rooms[data.id].numPeople++;
                let joinedRoom = rooms[data.id];
                joinedRoom.id = data.id;
                socket.emit('joined room', joinedRoom);
                socket.join(data.id.toString());
                connectedRoomId = data.id;
                console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`);
                console.log(connectedRoomId);
                io.emit('all rooms', getRoomView(rooms));
            }
        }
    });
    //join a room with a code
    socket.on('join private room', (data) => {
        console.log(`${socket.id} tried to join private room:`);
        if (!data.code) {
            return;
        }
        const roomIndex = rooms.findIndex((r) => r.joinCode === data.code);
        if (roomIndex === -1) {
            return;
        }
        if (roomIndex === connectedRoomId) {
            return;
        }
        if (connectedRoomId !== -1) {
            socket.leave(connectedRoomId.toString());
            rooms[connectedRoomId].numPeople--;
            connectedRoomId = -1;
            io.emit('all rooms', getRoomView(rooms));
        }
        rooms[roomIndex].numPeople++;
        let joinedRoom = rooms[roomIndex];
        socket.emit('joined room', joinedRoom);
        socket.join(roomIndex.toString());
        connectedRoomId = roomIndex;
        console.log(`${socket.id} joined to private room ${roomIndex} - ${rooms[roomIndex].name}`);
        console.log(connectedRoomId);
    });
    //leave room
    socket.on('leave', () => {
        if (connectedRoomId !== -1) {
            socket.leave(connectedRoomId.toString());
            rooms[connectedRoomId].numPeople--;
            connectedRoomId = -1;
            socket.emit('left room');
            io.emit('all rooms', getRoomView(rooms));
        }
    });
    //receive message
    socket.on('new message', (data) => {
        var _a;
        if (connectedRoomId !== -1) {
            console.log(`${socket.id}: ${data} - ${connectedRoomId}`);
            let msg = { username: (_a = users.get(socket.id)) === null || _a === void 0 ? void 0 : _a.username, message: data };
            console.log(`broadcast to ${connectedRoomId} - ${rooms[connectedRoomId].joinCode}`);
            io.to(connectedRoomId.toString()).emit('new message', msg);
        }
    });
    //private message
    socket.on('private message', (data) => {
        console.log(`message from: ${socket.id} to ${data.socketId}  ${data.message}`);
        if (data.socketId) {
            const user = users.get(socket.id);
            if (user) {
                socket.emit('private message', { socketId: data.socketId, message: data.message, username: user.username });
                socket.to(data.socketId).emit('private message', { socketId: socket.id, message: data.message, username: user.username });
            }
        }
    });
    //rooms
    //fetch rooms
    socket.on('get rooms', () => {
        console.log(`${socket.id} asked for rooms`);
        socket.emit('all rooms', getRoomView(rooms));
    });
    //create new room
    socket.on('new room', (data) => {
        let hasPwd = false;
        if (data.password) {
            hasPwd = true;
        }
        rooms.push({ id: rooms.length, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd });
        console.log(`added new room: ${data.name} ${data.password}`);
        io.emit('new room');
    });
    socket.on('new private room', (data) => {
        let code = (0, crypto_1.randomInt)(1000, 10000);
        if (joinCodes.findIndex((i) => i === code) !== -1) {
            console.log("code exists");
            return;
        }
        console.log(code);
        joinCodes.push(code);
        rooms.push({ id: rooms.length, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() });
        socket.emit('private room code', (code));
    });
});
httpServer.listen(port);
console.log(`Listening on port ${port}`);
function getRoomView(_rooms) {
    return _rooms.filter((r) => { return r.public; }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }));
}
function getUsers(_users) {
    return [..._users.values()];
}
