"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomView = exports.emitAllRooms = exports.joinPrivateRoomEvent = exports.joinRoomEvent = exports.createPrivateRoomEvent = exports.createRoomEvent = exports.leaveRoomEvent = exports.getRoomEvent = void 0;
const crypto_1 = require("crypto");
const getRoomEvent = (socket, rooms) => {
    console.log(`${socket.id} asked for rooms`);
    socket.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.getRoomEvent = getRoomEvent;
const leaveRoomEvent = (socket, io, connectedRoomId, rooms) => {
    if (connectedRoomId !== -1) {
        console.log(`${socket.id} left room ${connectedRoomId}`);
        socket.leave(connectedRoomId.toString());
        rooms[connectedRoomId].numPeople--;
        socket.emit('left room');
        (0, exports.emitAllRooms)(io, rooms);
        return -1;
    }
    return connectedRoomId;
};
exports.leaveRoomEvent = leaveRoomEvent;
const createRoomEvent = (io, data, rooms) => {
    let hasPwd = false;
    if (data.password !== undefined && data.password.length > 0) {
        hasPwd = true;
    }
    rooms.push({ id: rooms.length, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd });
    console.log(`added new room: ${data.name} ${data.password}`);
    io.emit('new room');
};
exports.createRoomEvent = createRoomEvent;
const createPrivateRoomEvent = (socket, io, data, rooms, joinCodes) => {
    const code = generateJoinCode(joinCodes);
    if (code === -1) {
        // failed to generate code
        return;
    }
    console.log(code);
    joinCodes.push(code);
    rooms.push({ id: rooms.length, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() });
    socket.emit('private room code', (code.toString()));
};
exports.createPrivateRoomEvent = createPrivateRoomEvent;
const joinRoomEvent = (socket, io, data, rooms, connectedRoomId) => {
    console.log(`${socket.id} tried to join: ${data.id}`);
    if (data.id !== undefined && data.id !== connectedRoomId) {
        if (connectedRoomId !== -1) {
            socket.leave(connectedRoomId.toString());
            rooms[connectedRoomId].numPeople--;
            connectedRoomId = -1;
        }
        if (rooms[data.id].hasPassword === undefined || (rooms[data.id].password === data.password)) {
            rooms[data.id].numPeople++;
            const joinedRoom = rooms[data.id];
            joinedRoom.id = data.id;
            socket.emit('joined room', joinedRoom);
            socket.join(data.id.toString());
            connectedRoomId = data.id;
            console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`);
            console.log(connectedRoomId);
            (0, exports.emitAllRooms)(io, rooms);
        }
    }
    return connectedRoomId;
};
exports.joinRoomEvent = joinRoomEvent;
const joinPrivateRoomEvent = (socket, io, data, rooms, connectedRoomId) => {
    console.log(`${socket.id} tried to join private room:`);
    if (data === undefined) {
        return connectedRoomId;
    }
    const roomIndex = rooms.findIndex((r) => r.joinCode === data);
    if (roomIndex === -1) {
        return connectedRoomId;
    }
    if (roomIndex === connectedRoomId) {
        return connectedRoomId;
    }
    if (connectedRoomId !== -1) {
        socket.leave(connectedRoomId.toString());
        rooms[connectedRoomId].numPeople--;
        connectedRoomId = -1;
        io.emit('all rooms', (0, exports.getRoomView)(rooms));
    }
    rooms[roomIndex].numPeople++;
    const joinedRoom = rooms[roomIndex];
    socket.emit('joined room', joinedRoom);
    socket.join(roomIndex.toString());
    connectedRoomId = roomIndex;
    console.log(`${socket.id} joined to private room ${roomIndex} - ${rooms[roomIndex].name}`);
    console.log(connectedRoomId);
    return connectedRoomId;
};
exports.joinPrivateRoomEvent = joinPrivateRoomEvent;
const emitAllRooms = (io, rooms) => {
    io.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.emitAllRooms = emitAllRooms;
const getRoomView = (rooms) => {
    return rooms.filter((r) => { return r.public; }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }));
};
exports.getRoomView = getRoomView;
const generateJoinCode = (joinCodes) => {
    let code = 0;
    let n = 0;
    do {
        code = (0, crypto_1.randomInt)(10000, 100000);
        n++;
    } while (n < 5 && joinCodes.findIndex((i) => i === code) !== -1);
    if (n >= 5) {
        // failed to generate a code
        return -1;
    }
    return code;
};
