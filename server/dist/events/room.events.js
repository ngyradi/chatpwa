"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromRoom = exports.getRoomView = exports.emitAllRooms = exports.joinPrivateRoomEvent = exports.joinRoomEvent = exports.createPrivateRoomEvent = exports.createRoomEvent = exports.leaveRoomEvent = exports.getRoomEvent = void 0;
const crypto_1 = require("crypto");
const getRoomEvent = (socket, rooms) => {
    console.log(`${socket.id} asked for rooms`);
    socket.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.getRoomEvent = getRoomEvent;
const leaveRoomEvent = (socket, io, connectedRoomId, rooms) => {
    if (connectedRoomId !== -1) {
        console.log(`${socket.id} left room ${connectedRoomId}`);
        (0, exports.disconnectFromRoom)(socket, io, connectedRoomId, rooms);
        return -1;
    }
    return connectedRoomId;
};
exports.leaveRoomEvent = leaveRoomEvent;
const createRoomEvent = (socket, io, data, rooms, connectedRoomId) => {
    let hasPwd = false;
    if (data.password !== undefined && data.password.length > 0) {
        hasPwd = true;
    }
    const newId = rooms.length;
    rooms.push({ id: newId, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd });
    console.log(`added new room: ${data.name} ${data.password}`);
    io.emit('new room');
    console.log(connectedRoomId);
    if (connectedRoomId !== undefined) {
        return joinUserToRoom(socket, io, rooms, newId, connectedRoomId);
    }
};
exports.createRoomEvent = createRoomEvent;
const createPrivateRoomEvent = (socket, io, data, rooms, joinCodes, connectedRoomId) => {
    const code = generateJoinCode(joinCodes);
    if (code === -1) {
        // failed to generate code
        return;
    }
    joinCodes.push(code);
    const newId = rooms.length;
    rooms.push({ id: newId, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() });
    socket.emit('private room code', (code.toString()));
    if (connectedRoomId !== undefined) {
        return joinUserToRoom(socket, io, rooms, newId, connectedRoomId);
    }
};
exports.createPrivateRoomEvent = createPrivateRoomEvent;
const joinRoomEvent = (socket, io, data, rooms, connectedRoomId) => {
    console.log(`${socket.id} tried to join: ${data.id}`);
    if (data.id !== undefined) {
        if (rooms[data.id].hasPassword === false || (rooms[data.id].password === data.password)) {
            connectedRoomId = joinUserToRoom(socket, io, rooms, data.id, connectedRoomId);
        }
    }
    return connectedRoomId;
};
exports.joinRoomEvent = joinRoomEvent;
const joinPrivateRoomEvent = (socket, io, joinCode, rooms, connectedRoomId) => {
    console.log(`${socket.id} tried to join private room:`);
    if (joinCode === undefined) {
        return connectedRoomId;
    }
    const roomIndex = rooms.findIndex((r) => r.joinCode === joinCode);
    if (roomIndex === -1) {
        return connectedRoomId;
    }
    return joinUserToRoom(socket, io, rooms, roomIndex, connectedRoomId);
};
exports.joinPrivateRoomEvent = joinPrivateRoomEvent;
const generateJoinCode = (joinCodes) => {
    let code = 0;
    let n = 0;
    do {
        code = (0, crypto_1.randomInt)(10000, 100000);
        n++;
    } while (n < 5 && joinCodes.findIndex((i) => i === code) !== -1);
    // failed to generate a code
    if (n >= 5) {
        return -1;
    }
    return code;
};
const joinUserToRoom = (socket, io, rooms, roomId, connectedRoomId) => {
    if (connectedRoomId === roomId || rooms[roomId].deleted === true) {
        return roomId;
    }
    if (connectedRoomId !== -1) {
        (0, exports.disconnectFromRoom)(socket, io, connectedRoomId, rooms);
    }
    rooms[roomId].numPeople++;
    const joinedRoom = rooms[roomId];
    joinedRoom.id = roomId;
    socket.join(roomId.toString());
    socket.emit('joined room', joinedRoom);
    console.log(`${socket.id} joined ${roomId} - ${rooms[roomId].name}`);
    (0, exports.emitAllRooms)(io, rooms);
    return roomId;
};
const emitAllRooms = (io, rooms) => {
    io.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.emitAllRooms = emitAllRooms;
const getRoomView = (rooms) => {
    return rooms.filter((r) => { return (r.public === true && r.deleted !== true); }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }));
};
exports.getRoomView = getRoomView;
const disconnectFromRoom = (socket, io, connectedRoomId, rooms) => {
    socket.leave(connectedRoomId.toString());
    rooms[connectedRoomId].numPeople--;
    if (rooms[connectedRoomId].numPeople <= 0 && rooms[connectedRoomId].public === true) {
        rooms[connectedRoomId].deleted = true;
    }
    (0, exports.emitAllRooms)(io, rooms);
};
exports.disconnectFromRoom = disconnectFromRoom;
