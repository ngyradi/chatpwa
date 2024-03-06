"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.emitAllUsers = exports.getUserEvent = exports.userDisconnectEvent = exports.userJoinEvent = void 0;
const room_events_1 = require("./room.events");
// Store the socket id in the user value for private messaging
// Identify the user with their socket id and store in a map
// Tell connected clients to refresh their user list
const userJoinEvent = (socket, io, data, users) => {
    console.log(`${data.username} joined`);
    data.socketId = socket.id;
    users.set(socket.id, data);
    io.emit('all users', (0, exports.getUsers)(users));
};
exports.userJoinEvent = userJoinEvent;
// When disconnecting if the user was connected to a room disconnect them from it
const userDisconnectEvent = (socket, io, users, rooms, connectedRoomId) => {
    console.log('user disconnected');
    users.delete(socket.id);
    if (connectedRoomId !== -1) {
        (0, room_events_1.disconnectFromRoom)(socket, io, connectedRoomId, rooms);
    }
    (0, exports.emitAllUsers)(io, users);
};
exports.userDisconnectEvent = userDisconnectEvent;
const getUserEvent = (socket, users) => {
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
