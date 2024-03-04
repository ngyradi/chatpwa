"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateMessageEvent = exports.chatMessageEvent = void 0;
const chatMessageEvent = (socket, io, data, rooms, users, connectedRoomId) => {
    var _a;
    if (connectedRoomId !== -1) {
        console.log(`${socket.id}: ${data} - ${connectedRoomId}`);
        let msg = { username: (_a = users.get(socket.id)) === null || _a === void 0 ? void 0 : _a.username, message: data };
        console.log(`broadcast to ${connectedRoomId} - ${rooms[connectedRoomId].joinCode}`);
        io.to(connectedRoomId.toString()).emit('new message', msg);
    }
};
exports.chatMessageEvent = chatMessageEvent;
const privateMessageEvent = (socket, users, data) => {
    console.log(`message from: ${socket.id} to ${data.socketId}  ${data.message}`);
    if (data.socketId) {
        const user = users.get(socket.id);
        if (user) {
            socket.emit('private message', { socketId: data.socketId, message: data.message, username: user.username });
            socket.to(data.socketId).emit('private message', { socketId: socket.id, message: data.message, username: user.username });
        }
    }
};
exports.privateMessageEvent = privateMessageEvent;
