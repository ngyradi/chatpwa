import { type Socket, type Server } from 'socket.io'
import { type ChatMessage, type ChatRoom, type PrivateMessage, type User } from '../model/chatroom'

export const chatMessageEvent = (socket: Socket, io: Server, data: string, rooms: ChatRoom[], users: Map<string, User>, connectedRoomId: number): void => {
  if (connectedRoomId !== -1 && data.length > 0) {
    console.log(`${socket.id}: ${data} - ${connectedRoomId}`)
    const msg: ChatMessage = { username: users.get(socket.id)?.username, message: data }
    console.log(`broadcast to ${connectedRoomId} - ${rooms[connectedRoomId].joinCode}`)
    io.to(connectedRoomId.toString()).emit('new message', msg)
  }
}

export const privateMessageEvent = (socket: Socket, users: Map<string, User>, data: PrivateMessage): void => {
  console.log(`message from: ${socket.id} to ${data.socketId}  ${data.message}`)
  if (data.socketId !== undefined) {
    const user = users.get(socket.id)
    if (user !== undefined) {
      socket.emit('private message', { socketId: data.socketId, message: data.message, username: user.username })
      socket.to(data.socketId).emit('private message', { socketId: socket.id, message: data.message, username: user.username })
    }
  }
}
