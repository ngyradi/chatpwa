import { type Socket, type Server } from 'socket.io'
import { type ChatRoom, type User } from '../model/chatroom'
import { disconnectFromRoom } from './room.events'

export const userJoinEvent = (socket: Socket, io: Server, data: User, users: Map<string, User>): void => {
  console.log(`${data.username} joined`)
  data.socketId = socket.id
  users.set(socket.id, data)
  io.emit('all users', getUsers(users))
}

export const userDisconnectEvent = (socket: Socket, io: Server, users: Map<string, User>, rooms: ChatRoom[], connectedRoomId: number): void => {
  console.log('user disconnected')
  users.delete(socket.id)
  if (connectedRoomId !== -1) {
    disconnectFromRoom(socket, io, connectedRoomId, rooms)
  }
  emitAllUsers(io, users)
}

export const getUserEvent = (socket: Socket, users: Map<string, User>): void => {
  console.log(`${socket.id} asked for online users`)
  socket.emit('all users', getUsers(users))
}

export const emitAllUsers = (io: Server, users: Map<string, User>): void => {
  io.emit('all users', getUsers(users))
}

export const getUsers = (_users: Map<string, User>): User[] => {
  return [..._users.values()]
}
