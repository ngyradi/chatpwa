import { type Socket, type Server } from 'socket.io'
import { type ChatMessage, type ChatRoom, type PrivateMessage, type User } from '../model/chatroom'

// When a user sends a message send it to all other users connected to the same room
export const chatMessageEvent = (socket: Socket, io: Server, data: string, rooms: ChatRoom[], users: Map<string, User>, connectedRoomId: number): void => {
  if (connectedRoomId !== -1 && data.length > 0) {
    const msg: ChatMessage = { username: users.get(socket.id)?.username, message: data }
    io.to(connectedRoomId.toString()).emit('new message', msg)
  }
}

// Send the private message to the sender and the receiver
// We send it back to the sender so they can only see their message if it is successful
export const privateMessageEvent = (socket: Socket, users: Map<string, User>, data: PrivateMessage): void => {
  if (data.socketId !== undefined) {
    const user = users.get(socket.id)
    if (user !== undefined) {
      socket.emit('private message', { socketId: data.socketId, message: data.message, username: user.username })
      socket.to(data.socketId).emit('private message', { socketId: socket.id, message: data.message, username: user.username })
    }
  }
}
