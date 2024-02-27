import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { ChatMessage, ChatRoom, User } from '../models/Chatroom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: ChatMessage[];
  public connectedRoom$ = new Subject<ChatRoom>();
  public connected$ = new BehaviorSubject(false);
  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);
  public users$ = new BehaviorSubject<User[]>([]);

  private socket: Socket;
  private connectedRoom?: ChatRoom;

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

    this.socket.on('joinedRoom', (data: ChatRoom) => {
      this.connected$.next(true);
      this.connectedRoom$.next(data);
      this.connectedRoom = data;
    })

    this.socket.on('leftRoom', () => {
      this.connected$.next(false);
    })

    this.socket.on('new message', (data) => {
      this.messages.push(data);
    })
  }

  destroyConnection() {
    this.socket.disconnect();
  }

  sendMessage = (message: string) => {
    this.socket.emit('new message', message);
  }

  joinRoom = (id?: number, password?: string) => {
    this.socket.emit('joinRoom', { id: id, password: password });
  }

  createRoom(name: string, password = "") {
    name = name.trim();
    if (name) {
      this.socket.emit('new room', { name: name, password: password });
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

}
