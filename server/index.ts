import { createServer } from 'http'
import { Server, type Socket } from 'socket.io'
import { type ChatRoom, type PrivateMessage, type User } from './model/chatroom'
import { createPrivateRoomEvent, createRoomEvent, getRoomEvent, joinPrivateRoomEvent, joinRoomEvent, leaveRoomEvent } from './events/room.events'
import { getUserEvent, userDisconnectEvent, userJoinEvent } from './events/user.events'
import { chatMessageEvent, privateMessageEvent } from './events/message.events'

const port = 3000
const httpServer = createServer()

const rooms = [] as ChatRoom[]
const users = new Map<string, User>()
const joinCodes = [] as number[]

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200'
  }
})

io.on('connection', (socket: Socket) => {
  console.log(`${socket.id} connected`)
  let connectedRoomId = -1

  socket.on('join', (data: User) => {
    userJoinEvent(socket, io, data, users)
  })

  socket.on('disconnect', () => {
    userDisconnectEvent(socket, io, users, rooms, connectedRoomId)
  })

  socket.on('get users', () => {
    getUserEvent(socket, users)
  })

  socket.on('get rooms', () => {
    getRoomEvent(socket, rooms)
  })

  socket.on('new room', (data: ChatRoom) => {
    createRoomEvent(io, data, rooms)
  })

  socket.on('new private room', (data: ChatRoom) => {
    createPrivateRoomEvent(socket, io, data, rooms, joinCodes)
  })

  socket.on('join room', (data: ChatRoom) => {
    connectedRoomId = joinRoomEvent(socket, io, data, rooms, connectedRoomId)
    console.log(socket.rooms)
  })

  socket.on('join private room', (data: string) => {
    connectedRoomId = joinPrivateRoomEvent(socket, io, data, rooms, connectedRoomId)
  })

  socket.on('leave', () => {
    connectedRoomId = leaveRoomEvent(socket, io, connectedRoomId, rooms)
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
