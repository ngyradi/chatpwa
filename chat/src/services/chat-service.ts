import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { type Socket, io } from 'socket.io-client'
import { type ChatMessage, type ChatRoom, type PrivateMessage, type User } from '../models/chatroom'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages$ = new BehaviorSubject<ChatMessage[] | undefined>(undefined)
  public connectedRoom$ = new BehaviorSubject<ChatRoom | undefined>(undefined)
  public rooms$ = new BehaviorSubject<ChatRoom[]>([])
  public users$ = new BehaviorSubject<User[]>([])
  public privateRoomCode$ = new BehaviorSubject<string>('')
  public privateMessageUser$ = new BehaviorSubject<User | undefined>(undefined)

  private readonly socket: Socket
  private connectedRoom?: ChatRoom
  private readonly privateMessages = new Map<string, ChatMessage[]>()
  private messages: ChatMessage[]

  private readonly host = 'http://localhost:3000'

  constructor (@Inject(UserService) private readonly userService: UserService) {
    this.messages = []
    this.socket = io(this.host)

    this.socket.on('connect', () => {
      const username = this.userService.getUser()?.firstName + ' ' + this.userService.getUser()?.lastName
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

    this.socket.on('joined room', (data: ChatRoom) => {
      this.messages = [] as ChatMessage[]
      this.messages.push({ message: `Chatting in: ${data.name}`, info: true })
      this.connectedRoom = data
      this.connectedRoom$.next(data)
      this.closePrivateMessage()
      this.messages$.next(this.messages)
    })

    this.socket.on('left room', () => {
      this.connectedRoom$.next(undefined)
    })

    this.socket.on('new message', (data: ChatMessage) => {
      console.log(data)
      this.messages.push(data)
    })

    this.socket.on('private room code', (data: string) => {
      console.log(data)
      this.privateRoomCode$.next(data)
    })

    this.socket.on('private message', (data: PrivateMessage) => {
      if (data.socketId !== undefined) {
        const msgArr = this.privateMessages.get(data.socketId) ?? [] as ChatMessage[]
        msgArr.push({ username: data.username, message: data.message })
        console.log(msgArr)
        this.privateMessages.set(data.socketId, msgArr)
      }
    })
  }

  getSocketId (): string | undefined {
    return this.socket?.id
  }

  destroyConnection (): void {
    this.socket.disconnect()
  }

  sendMessage = (message: string): void => {
    this.socket.emit('new message', message)
  }

  joinRoom = (id?: number, password?: string): void => {
    this.socket.emit('join room', { id, password })
  }

  joinPrivateRoom (code: string): void {
    code = code.trim()
    if (code !== undefined) {
      this.socket.emit('join private room', code)
    }
  }

  createRoom (name: string, password = ''): void {
    name = name.trim()
    if (name !== undefined) {
      this.socket.emit('new room', { name, password, public: true })
      // join after creating the room
    }
  }

  createPrivateRoom (name: string): void {
    name = name.trim()
    if (name !== undefined) {
      this.socket.emit('new private room', { name })
    }
  }

  leaveRoom (): void {
    if (this.connectedRoom !== undefined) {
      this.socket.emit('leave', this.connectedRoom)
    }
  }

  getRooms (): void {
    this.socket.emit('get rooms')
  }

  getUsers (): void {
    this.socket.emit('get users')
  }

  selectPrivateMessageUser (user: User): void {
    this.privateMessageUser$.next(user)
  }

  initPrivateMessages (user?: User): void {
    if (user?.socketId !== undefined && this.privateMessages.get(user.socketId) === undefined) {
      this.privateMessages.set(user.socketId, [] as ChatMessage[])
    }
  }

  getPrivateMessages (user?: User): ChatMessage[] | undefined {
    if (user?.socketId !== undefined) {
      return this.privateMessages.get(user.socketId)
    }
    return [] as ChatMessage[]
  }

  closePrivateMessage (): void {
    this.privateMessageUser$.next(undefined)
  }

  sendPrivateMessage (pm: PrivateMessage): void {
    if (pm.message?.trim() !== undefined) {
      this.socket.emit('private message', pm)
    }
  }

  exit (): void {
    this.socket.close()
  }
}
