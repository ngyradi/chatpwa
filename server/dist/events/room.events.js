"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromRoom = exports.getRoomView = exports.emitAllRooms = exports.joinPrivateRoomEvent = exports.joinRoomEvent = exports.createPrivateRoomEvent = exports.createRoomEvent = exports.leaveRoomEvent = exports.getRoomEvent = void 0;
const crypto_1 = require("crypto");
const getRoomEvent = (socket, rooms) => {
    socket.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.getRoomEvent = getRoomEvent;
// Set the connected room id to -1 if leaving is successful
const leaveRoomEvent = (socket, io, connectedRoomId, rooms) => {
    if (connectedRoomId !== -1) {
        (0, exports.disconnectFromRoom)(socket, io, connectedRoomId, rooms);
        return -1;
    }
    return connectedRoomId;
};
exports.leaveRoomEvent = leaveRoomEvent;
// The id of the room in the array is added to the room only for clientside purposes
// After creating the new room tell connected clients to refresh their list
// Join the creating user to the new room
const createRoomEvent = (socket, io, data, rooms, connectedRoomId) => {
    let hasPwd = false;
    if (data.password !== undefined && data.password.length > 0) {
        hasPwd = true;
    }
    const newId = rooms.length;
    rooms.push({ id: newId, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd });
    io.emit('new room');
    if (connectedRoomId !== undefined) {
        return joinUserToRoom(socket, io, rooms, newId, connectedRoomId);
    }
};
exports.createRoomEvent = createRoomEvent;
// Private rooms aren't protected with a password instead they require a code to join
// Set the public parameter to false so clients don't receive any data about private rooms
// Send the join code back to the user
// Join the creating user to the new room
const createPrivateRoomEvent = (socket, io, data, rooms, joinCodes, connectedRoomId) => {
    const code = generateJoinCode(joinCodes);
    if (code === -1) {
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
// Find the private room from the join code and join the user
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
// Try to generate a 5 digit code
// Fail if generating isn't successful after 5 tries
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
// Check if a user is already in another room when joining and disconnect them
// Increase the number of people in the room
// Tell the user joining the room was successful
// Tell all clients to update their room list
// Return the room id so we can store it in the users connectedRoomId
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
    (0, exports.emitAllRooms)(io, rooms);
    return roomId;
};
const emitAllRooms = (io, rooms) => {
    io.emit('all rooms', (0, exports.getRoomView)(rooms));
};
exports.emitAllRooms = emitAllRooms;
// Filter the rooms so clients only receive data they are supposed to see
// Filter out private and deleted rooms
const getRoomView = (rooms) => {
    return rooms.filter((r) => { return (r.public === true && r.deleted !== true); }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }));
};
exports.getRoomView = getRoomView;
// Disconnect the user from a room
// Decrease the number of people in the room
// If a room is public and there are no users in it delete it
// Tell all clients to update their room list
const disconnectFromRoom = (socket, io, connectedRoomId, rooms) => {
    socket.leave(connectedRoomId.toString());
    rooms[connectedRoomId].numPeople--;
    if (rooms[connectedRoomId].numPeople <= 0 && rooms[connectedRoomId].public === true) {
        rooms[connectedRoomId].deleted = true;
    }
    (0, exports.emitAllRooms)(io, rooms);
};
exports.disconnectFromRoom = disconnectFromRoom;
