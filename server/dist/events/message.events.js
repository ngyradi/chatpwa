"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateMessageEvent = exports.chatMessageEvent = void 0;
// When a user sends a message send it to all other users connected to the same room
const chatMessageEvent = (socket, io, data, rooms, users, connectedRoomId) => {
    var _a;
    if (connectedRoomId !== -1 && data.length > 0) {
        const msg = { username: (_a = users.get(socket.id)) === null || _a === void 0 ? void 0 : _a.username, message: data };
        io.to(connectedRoomId.toString()).emit('new message', msg);
    }
};
exports.chatMessageEvent = chatMessageEvent;
// Send the private message to the sender and the receiver
// We send it back to the sender so they can only see their message if it is successful
const privateMessageEvent = (socket, users, data) => {
    if (data.socketId !== undefined) {
        const user = users.get(socket.id);
        if (user !== undefined) {
            socket.emit('private message', { socketId: data.socketId, message: data.message, username: user.username });
            socket.to(data.socketId).emit('private message', { socketId: socket.id, message: data.message, username: user.username });
        }
    }
};
exports.privateMessageEvent = privateMessageEvent;
