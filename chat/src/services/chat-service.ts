import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { ChatMessage, ChatRoom, PrivateMessage, User } from '../models/chatroom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: ChatMessage[];
  public connectedRoom$ = new BehaviorSubject<ChatRoom | undefined>(undefined);
  public connected$ = new BehaviorSubject(false);
  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);
  public users$ = new BehaviorSubject<User[]>([]);
  public privateRoomCode$ = new BehaviorSubject<string>("");
  public privateMessageUser$ = new BehaviorSubject<User | undefined>(undefined);

  private socket: Socket;
  private connectedRoom?: ChatRoom;
  private privateMessages = new Map<string, ChatMessage[]>();

  private readonly host = "http://localhost:3000";

  constructor() {
    this.messages = [];
    this.connected$.next(false);
    this.socket = io(this.host);

    this.socket.on('connect', () => {
      this.socket.emit('join', { username: "test user" });
      this.getRooms();
      this.getUsers();
    })

    this.socket.on('all users', (data) => {
      this.users$.next(data);
    })

    this.socket.on('all rooms', (data: ChatRoom[]) => {
      this.rooms$.next(data);
    })

    this.socket.on('new room', () => {
      this.getRooms();
    })

    this.socket.on('joined room', (data: ChatRoom) => {
      this.connectedRoom$.next(data);
      this.connectedRoom = data;
      this.connected$.next(true);
    })

    this.socket.on('left room', () => {
      this.connected$.next(false);
    })

    this.socket.on('new message', (data) => {
      console.log(data);
      this.messages.push(data);
    })

    this.socket.on('private room code', (data) => {
      console.log(data);
      this.privateRoomCode$.next(data)
    })


    this.socket.on('private message', (data) => {
      console.log(data);
    })
  }

  getSocketId() {
    return this.socket?.id;
  }

  destroyConnection() {
    this.socket.disconnect();
  }

  sendMessage = (message: string) => {
    this.socket.emit('new message', message);
  }

  joinRoom = (id?: number, password?: string) => {
    this.socket.emit('join room', { id: id, password: password });
  }

  joinPrivateRoom(code: string) {
    code = code.trim();
    if (code) {
      this.socket.emit('join private room', { code: code });
    }
  }

  createRoom(name: string, password = "") {
    name = name.trim();
    if (name) {
      this.socket.emit('new room', { name: name, password: password, public: true });
    }
  }

  createPrivateRoom(name: string) {
    name = name.trim();
    if (name) {
      this.socket.emit('new private room', { name: name })
    }
  }

  leaveRoom() {
    if (this.connectedRoom) {
      this.socket.emit('leave', this.connectedRoom);
    }
  }

  getRooms() {
    this.socket.emit('get rooms');
  }

  getUsers() {
    this.socket.emit('get users');
  }

  selectPrivateMessageUser(user: User) {
    this.privateMessageUser$.next(user);
  }

  closePrivateMessage() {
    this.privateMessageUser$.next(undefined);
  }

  sendPrivateMessage(pm: PrivateMessage) {
    console.log(pm);
    this.socket.emit('private message', pm)
  }

}
