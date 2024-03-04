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
    socket.leave(connectedRoomId.toString())

    rooms[connectedRoomId].numPeople--

    socket.emit('left room')
    emitAllRooms(io, rooms)

    return -1
  }
  return connectedRoomId
}

export const createRoomEvent = (io: Server, data: ChatRoom, rooms: ChatRoom[]): void => {
  let hasPwd = false
  if (data.password !== undefined && data.password.length > 0) {
    hasPwd = true
  }

  rooms.push({ id: rooms.length, name: data.name, password: data.password, numPeople: 0, public: data.public, hasPassword: hasPwd })
  console.log(`added new room: ${data.name} ${data.password}`)

  io.emit('new room')
}

export const createPrivateRoomEvent = (socket: Socket, io: Server, data: ChatRoom, rooms: ChatRoom[], joinCodes: number[]): void => {
  const code = generateJoinCode(joinCodes)
  if (code === -1) {
    // failed to generate code
    return
  }

  console.log(code)

  joinCodes.push(code)
  rooms.push({ id: rooms.length, name: data.name, numPeople: 0, public: false, hasPassword: false, joinCode: code.toString() })
  socket.emit('private room code', (code.toString()))
}

export const joinRoomEvent = (socket: Socket, io: Server, data: ChatRoom, rooms: ChatRoom[], connectedRoomId: number): number => {
  console.log(`${socket.id} tried to join: ${data.id}`)
  if (data.id !== undefined && data.id !== connectedRoomId) {
    if (connectedRoomId !== -1) {
      socket.leave(connectedRoomId.toString())
      rooms[connectedRoomId].numPeople--
      connectedRoomId = -1
    }

    if (rooms[data.id].hasPassword === undefined || (rooms[data.id].password === data.password)) {
      rooms[data.id].numPeople++

      const joinedRoom: ChatRoom = rooms[data.id]
      joinedRoom.id = data.id
      socket.emit('joined room', joinedRoom)
      socket.join(data.id.toString())

      connectedRoomId = data.id
      console.log(`${socket.id} joined ${data.id} - ${rooms[data.id].name}`)
      console.log(connectedRoomId)

      emitAllRooms(io, rooms)
    }
  }

  return connectedRoomId
}

export const joinPrivateRoomEvent = (socket: Socket, io: Server, data: string, rooms: ChatRoom[], connectedRoomId: number): number => {
  console.log(`${socket.id} tried to join private room:`)
  if (data === undefined) {
    return connectedRoomId
  }
  const roomIndex = rooms.findIndex((r) => r.joinCode === data)
  if (roomIndex === -1) {
    return connectedRoomId
  }
  if (roomIndex === connectedRoomId) {
    return connectedRoomId
  }

  if (connectedRoomId !== -1) {
    socket.leave(connectedRoomId.toString())
    rooms[connectedRoomId].numPeople--
    connectedRoomId = -1
    io.emit('all rooms', getRoomView(rooms))
  }

  rooms[roomIndex].numPeople++
  const joinedRoom: ChatRoom = rooms[roomIndex]
  socket.emit('joined room', joinedRoom)
  socket.join(roomIndex.toString())

  connectedRoomId = roomIndex
  console.log(`${socket.id} joined to private room ${roomIndex} - ${rooms[roomIndex].name}`)
  console.log(connectedRoomId)

  return connectedRoomId
}

export const emitAllRooms = (io: Server, rooms: ChatRoom[]): void => {
  io.emit('all rooms', getRoomView(rooms))
}

export const getRoomView = (rooms: ChatRoom[]): ChatRoom[] => {
  return rooms.filter((r) => { return r.public }).map((r) => ({ id: r.id, name: r.name, numPeople: r.numPeople, hasPassword: r.hasPassword }))
}

const generateJoinCode = (joinCodes: number[]): number => {
  let code = 0
  let n = 0
  do {
    code = randomInt(10000, 100000)
    n++
  } while (n < 5 && joinCodes.findIndex((i) => i === code) !== -1)

  if (n >= 5) {
    // failed to generate a code
    return -1
  }

  return code
}
