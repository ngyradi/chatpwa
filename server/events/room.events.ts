import { type Socket, type Server } from 'socket.io'
import { type ChatRoom } from '../model/chatroom'
import { randomInt } from 'crypto'

export const getRoomEvent = (socket: Socket, rooms: ChatRoom[]): void => {
  console.log(`${socket.id} asked for rooms`)

  socket.emit('all rooms', getRoomView(rooms))
}

export const leaveRoomEvent = (socket: Socket, io: Server, connectedRoomId: number, rooms: ChatRoom[]): number => {
  if (connectedRoomId !== -1) {
    console.log(`${socket.id} left room ${connectedRoomId}`)

    disconnectFromRoom(socket, io, connectedRoomId, rooms)

    return -1
  }
  return connectedRoomId
}

export const createRoomEvent = (socket: Socket, io: Server, data: ChatRoom, rooms: ChatRoom[], connectedRoomId?: number): number | undefined => {
  let hasPwd = false
  if (data.password !== undefined && data.password.length > 0) {
    hasPwd = true
  }

  const newId = rooms.length
  rooms.push({ id: newId, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd })
  console.log(`added new room: ${data.name} ${data.password}`)

  io.emit('new room')

  console.log(connectedRoomId)

  if (connectedRoomId !== undefined) {
    return joinUserToRoom(socket, io, rooms, newId, connectedRoomId)
  }
}

export const createPrivateRoomEvent = (socket: Socket, io: Server, data: ChatRoom, rooms: ChatRoom[], joinCodes: number[], connectedRoomId?: number): number | undefined => {
  const code = generateJoinCode(joinCodes)
  if (code === -1) {
    // failed to generate code
    return
  }
  joinCodes.push(code)

  const newId = rooms.length
  rooms.push({ id: newId, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() })
  socket.emit('private room code', (code.toString()))

  if (connectedRoomId !== undefined) {
    return joinUserToRoom(socket, io, rooms, newId, connectedRoomId)
  }
}

export const joinRoomEvent = (socket: Socket, io: Server, data: ChatRoom, rooms: ChatRoom[], connectedRoomId: number): number => {
  console.log(`${socket.id} tried to join: ${data.id}`)
  if (data.id !== undefined) {
    if (rooms[data.id].hasPassword === false || (rooms[data.id].password === data.password)) {
      connectedRoomId = joinUserToRoom(socket, io, rooms, data.id, connectedRoomId)
    }
  }

  return connectedRoomId
}

export const joinPrivateRoomEvent = (socket: Socket, io: Server, joinCode: string, rooms: ChatRoom[], connectedRoomId: number): number => {
  console.log(`${socket.id} tried to join private room:`)
  if (joinCode === undefined) {
    return connectedRoomId
  }
  const roomIndex = rooms.findIndex((r) => r.joinCode === joinCode)
  if (roomIndex === -1) {
    return connectedRoomId
  }

  return joinUserToRoom(socket, io, rooms, roomIndex, connectedRoomId)
}

const generateJoinCode = (joinCodes: number[]): number => {
  let code = 0
  let n = 0
  do {
    code = randomInt(10000, 100000)
    n++
  } while (n < 5 && joinCodes.findIndex((i) => i === code) !== -1)

  // failed to generate a code
  if (n >= 5) {
    return -1
  }

  return code
}

const joinUserToRoom = (socket: Socket, io: Server, rooms: ChatRoom[], roomId: number, connectedRoomId: number): number => {
  if (connectedRoomId === roomId || rooms[roomId].deleted === true) {
    return roomId
  }

  if (connectedRoomId !== -1) {
    disconnectFromRoom(socket, io, connectedRoomId, rooms)
  }

  rooms[roomId].numPeople++

  const joinedRoom: ChatRoom = rooms[roomId]
  joinedRoom.id = roomId
  socket.join(roomId.toString())
  socket.emit('joined room', joinedRoom)

  console.log(`${socket.id} joined ${roomId} - ${rooms[roomId].name}`)

  emitAllRooms(io, rooms)

  return roomId
}

export const emitAllRooms = (io: Server, rooms: ChatRoom[]): void => {
  io.emit('all rooms', getRoomView(rooms))
}

export const getRoomView = (rooms: ChatRoom[]): ChatRoom[] => {
  return rooms.filter((r) => { return (r.public === true && r.deleted !== true) }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }))
}

export const disconnectFromRoom = (socket: Socket, io: Server, connectedRoomId: number, rooms: ChatRoom[]): void => {
  socket.leave(connectedRoomId.toString())
  rooms[connectedRoomId].numPeople--
  if (rooms[connectedRoomId].numPeople <= 0 && rooms[connectedRoomId].public === true) {
    rooms[connectedRoomId].deleted = true
  }
  emitAllRooms(io, rooms)
}
