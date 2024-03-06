import { createServer } from 'http'
import { Server, type Socket } from 'socket.io'
import { type ChatRoom, type PrivateMessage, type User } from './model/chatroom'
import { createPrivateRoomEvent, createRoomEvent, getRoomEvent, joinPrivateRoomEvent, joinRoomEvent, leaveRoomEvent } from './events/room.events'
import { getUserEvent, userDisconnectEvent, userJoinEvent } from './events/user.events'
import { chatMessageEvent, privateMessageEvent } from './events/message.events'

const port = 3000
const httpServer = createServer()

const rooms = [] as ChatRoom[]

// Use the socket id as the key when storing users
const users = new Map<string, User>()

// Used to store codes for joining private rooms
const joinCodes = [] as number[]

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200'
  }
})

io.on('connection', (socket: Socket) => {
  console.log(`${socket.id} connected`)

  // Used to store which room the user is currently in
  // When connected to a room set it to the id of the room
  // Set to -1 when not in a room because ids cant be less than 0
  let connectedRoomId = -1

  socket.on('join', (data: User) => {
    userJoinEvent(socket, io, data, users)
  })

  // Handle when the socket disconnects for any reason
  socket.on('disconnect', () => {
    userDisconnectEvent(socket, io, users, rooms, connectedRoomId)
  })

  socket.on('leave', () => {
    connectedRoomId = leaveRoomEvent(socket, io, connectedRoomId, rooms)
  })

  socket.on('get users', () => {
    getUserEvent(socket, users)
  })

  socket.on('get rooms', () => {
    getRoomEvent(socket, rooms)
  })

  // If the returned value is defined the user has been joined to the room and we have to store it
  socket.on('new room', (data: ChatRoom) => {
    const res = createRoomEvent(socket, io, data, rooms, connectedRoomId)
    if (res !== undefined) {
      connectedRoomId = res
    }
  })

  socket.on('new private room', (data: ChatRoom) => {
    const res = createPrivateRoomEvent(socket, io, data, rooms, joinCodes, connectedRoomId)
    if (res !== undefined) {
      connectedRoomId = res
    }
  })

  socket.on('join room', (data: ChatRoom) => {
    connectedRoomId = joinRoomEvent(socket, io, data, rooms, connectedRoomId)
  })

  socket.on('join private room', (data: string) => {
    connectedRoomId = joinPrivateRoomEvent(socket, io, data, rooms, connectedRoomId)
  })

  socket.on('new message', (data: string) => {
    chatMessageEvent(socket, io, data, rooms, users, connectedRoomId)
  })

  socket.on('private message', (data: PrivateMessage) => {
    privateMessageEvent(socket, users, data)
  })
})

httpServer.listen(port)
console.log(`Listening on port ${port}`)
