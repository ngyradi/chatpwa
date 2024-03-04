"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.emitAllUsers = exports.getUserEvent = exports.userDisconnectEvent = exports.userJoinEvent = void 0;
const room_events_1 = require("./room.events");
const userJoinEvent = (socket, io, data, users) => {
    console.log(`${data.username} joined`);
    data.socketId = socket.id;
    users.set(socket.id, data);
    io.emit('all users', (0, exports.getUsers)(users));
};
exports.userJoinEvent = userJoinEvent;
const userDisconnectEvent = (socket, io, users, rooms, connectedRoomId) => {
    console.log('user disconnected');
    users.delete(socket.id);
    if (connectedRoomId !== -1) {
        if (rooms[connectedRoomId] !== undefined) {
            rooms[connectedRoomId].numPeople--;
            (0, room_events_1.emitAllRooms)(io, rooms);
        }
    }
    (0, exports.emitAllUsers)(io, users);
};
exports.userDisconnectEvent = userDisconnectEvent;
const getUserEvent = (socket, users) => {
    console.log(`${socket.id} asked for online users`);
    socket.emit('all users', (0, exports.getUsers)(users));
};
exports.getUserEvent = getUserEvent;
const emitAllUsers = (io, users) => {
    io.emit('all users', (0, exports.getUsers)(users));
};
exports.emitAllUsers = emitAllUsers;
const getUsers = (_users) => {
    return [..._users.values()];
};
exports.getUsers = getUsers;
