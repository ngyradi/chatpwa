"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const room_events_1 = require("./events/room.events");
const user_events_1 = require("./events/user.events");
const message_events_1 = require("./events/message.events");
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
    socket.on('join', (data) => {
        (0, user_events_1.userJoinEvent)(socket, io, data, users);
    });
    socket.on('disconnect', () => {
        (0, user_events_1.userDisconnectEvent)(socket, io, users, rooms, connectedRoomId);
    });
    socket.on('get users', () => {
        (0, user_events_1.getUserEvent)(socket, users);
    });
    socket.on('get rooms', () => {
        (0, room_events_1.getRoomEvent)(socket, rooms);
    });
    socket.on('new room', (data) => {
        (0, room_events_1.createRoomEvent)(io, data, rooms);
    });
    socket.on('new private room', (data) => {
        (0, room_events_1.createPrivateRoomEvent)(socket, io, data, rooms, joinCodes);
    });
    socket.on('join room', (data) => {
        connectedRoomId = (0, room_events_1.joinRoomEvent)(socket, io, data, rooms, connectedRoomId);
        console.log(socket.rooms);
    });
    socket.on('join private room', (data) => {
        connectedRoomId = (0, room_events_1.joinPrivateRoomEvent)(socket, io, data, rooms, connectedRoomId);
    });
    socket.on('leave', () => {
        connectedRoomId = (0, room_events_1.leaveRoomEvent)(socket, io, connectedRoomId, rooms);
    });
    socket.on('new message', (data) => {
        (0, message_events_1.chatMessageEvent)(socket, io, data, rooms, users, connectedRoomId);
    });
    socket.on('private message', (data) => {
        (0, message_events_1.privateMessageEvent)(socket, users, data);
    });
});
httpServer.listen(port);
console.log(`Listening on port ${port}`);
