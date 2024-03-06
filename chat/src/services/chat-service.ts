import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { type Socket, io } from 'socket.io-client'
import { type ChatMessage, type ChatRoom, type PrivateMessage, type User } from '../models/chatroom'
import { UserService } from './user.service'
import { ChatState } from '../models/ui.state'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  ChatState = ChatState

  // Behaviour subjects are used for updating the UI
  public connectedRoom$ = new BehaviorSubject<ChatRoom | undefined>(undefined)
  public rooms$ = new BehaviorSubject<ChatRoom[]>([])
  public users$ = new BehaviorSubject<User[]>([])

  // Used to show the join code when creating a private room
  public privateRoomCode$ = new BehaviorSubject<string>('')

  public privateMessageUser$ = new BehaviorSubject<User | undefined>(undefined)
  public messages$ = new BehaviorSubject<ChatMessage[] | undefined>(undefined)
  public chatState$ = new BehaviorSubject<ChatState>(ChatState.NONE)

  // Used in the service to handle chat logic
  private readonly socket: Socket
  private connectedRoom?: ChatRoom
  private privateMessageUser?: User
  private messages: ChatMessage[]

  // The key is the id of the socket we receive the message from
  private readonly privateMessages = new Map<string, ChatMessage[]>()

  private readonly host = 'http://localhost:3000'

  constructor (@Inject(UserService) private readonly userService: UserService) {
    this.messages = []
    this.socket = io(this.host)

    // After connecting get open rooms and online users
    this.socket.on('connect', () => {
      const username = this.userService.getUsername()
      if (username === undefined) {
        this.destroyConnection()
        return
      }
      this.socket.emit('join', { username })
      this.getRooms()
      this.getUsers()
    })

    this.socket.on('all users', (data: User[]) => {
      this.users$.next(data)
    })

    this.socket.on('all rooms', (data: ChatRoom[]) => {
      this.rooms$.next(data)
    })

    this.socket.on('new room', () => {
      this.getRooms()
    })

    // Clear messages when joining or changing rooms
    // Add an info message for users to see which room they are in
    this.socket.on('joined room', (data: ChatRoom) => {
      this.messages = [] as ChatMessage[]
      this.messages.push({ message: `Chatting in ${data.name}`, info: true })
      this.messages$.next(this.messages)

      this.setConnnectedRoom(data)
      this.chatState$.next(ChatState.ROOM)
    })

    this.socket.on('left room', () => {
      this.setConnnectedRoom(undefined)
      this.chatState$.next(ChatState.NONE)
    })

    this.socket.on('new message', (data: ChatMessage) => {
      this.messages.push(data)
    })

    // Receive the join code when creating a private room and display it
    this.socket.on('private room code', (data: string) => {
      this.privateRoomCode$.next(data)
    })

    // When receiving a private message push the message in the array of the user
    // If the user doesn't have an array create an empty one
    // After adding the message to the array update it in the map
    this.socket.on('private message', (data: PrivateMessage) => {
      if (data.socketId !== undefined) {
        const msgArr = this.privateMessages.get(data.socketId) ?? [] as ChatMessage[]
        msgArr.push({ username: data.username, message: data.message })
        this.privateMessages.set(data.socketId, msgArr)
      }
    })
  }

  sendMessage = (message: string): void => {
    if (message.trim() !== undefined && message.trim().length > 0) {
      this.socket.emit('new message', message)
    }
  }

  // Join a public chatroom
  // If the user is already in the room make the chat visible
  joinRoom = (id?: number, password?: string): void => {
    if (id === this.connectedRoom?.id) {
      this.chatState$.next(ChatState.ROOM)
    }
    this.socket.emit('join room', { id, password })
  }

  joinPrivateRoom (code: string): void {
    code = code.trim()
    if (code !== undefined && code.length > 0) {
      this.socket.emit('join private room', code)
    }
  }

  createRoom (name: string, password = ''): void {
    name = name.trim()
    if (name !== undefined) {
      this.socket.emit('new room', { name, password, public: true })
    }
  }

  createPrivateRoom (name: string): void {
    name = name.trim()
    if (name !== undefined) {
      this.socket.emit('new private room', { name })
    }
  }

  // When leaving a room check if a private message is open and show it
  // Otherwise show the placeholder join a room text
  leaveRoom (): void {
    if (this.connectedRoom !== undefined) {
      if (this.privateMessageUser !== undefined) {
        this.chatState$.next(ChatState.PRIVATE)
      } else {
        this.chatState$.next(ChatState.NONE)
      }
      this.socket.emit('leave', this.connectedRoom)
      this.setConnnectedRoom(undefined)
    }
  }

  selectPrivateMessageUser (user: User): void {
    this.setPrivateMessageUser(user)
    this.chatState$.next(ChatState.PRIVATE)
  }

  // Make an empty array for messages when opening a private message
  // This is done so the observable can update messages on screen
  initPrivateMessages (user?: User): void {
    if (user?.socketId !== undefined && this.privateMessages.get(user.socketId) === undefined) {
      this.privateMessages.set(user.socketId, [] as ChatMessage[])
    }
  }

  // When closing a private message window check if a chat room is open and show it
  closePrivateMessage (): void {
    this.setPrivateMessageUser(undefined)
    if (this.connectedRoom !== undefined) {
      this.chatState$.next(ChatState.ROOM)
    } else {
      this.chatState$.next(ChatState.NONE)
    }
  }

  sendPrivateMessage (pm: PrivateMessage): void {
    if (pm.message?.trim() !== undefined && pm.message.trim().length > 0) {
      this.socket.emit('private message', pm)
    }
  }

  getPrivateMessages (user?: User): ChatMessage[] | undefined {
    if (user?.socketId !== undefined) {
      return this.privateMessages.get(user.socketId)
    }
    return [] as ChatMessage[]
  }

  // Get open rooms from the server
  getRooms (): void {
    this.socket.emit('get rooms')
  }

  // Get online users from the server
  getUsers (): void {
    this.socket.emit('get users')
  }

  getSocketId (): string | undefined {
    return this.socket?.id
  }

  destroyConnection (): void {
    this.socket.disconnect()
  }

  setConnnectedRoom = (room: ChatRoom | undefined): void => {
    this.connectedRoom = room
    this.connectedRoom$.next(room)
  }

  setPrivateMessageUser = (user: User | undefined): void => {
    this.privateMessageUser = user
    this.privateMessageUser$.next(user)
  }
}
