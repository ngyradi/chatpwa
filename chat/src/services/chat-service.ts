import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { ChatMessage, ChatRoom } from '../models/Chatroom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: ChatMessage[];
  public connected$ = new BehaviorSubject(false);
  public connectedRoom?: ChatRoom;

  private socket: Socket;

  private readonly host = "http://localhost:3000";

  constructor() {
    this.messages = [];
    this.connected$.next(false);

    this.socket = io(this.host);

    this.socket.on('joined', (data: ChatRoom) => {
      this.connected$.next(true);

      this.connectedRoom = data;
      console.log(`connected to:`)
      console.log(data);
    })

    this.socket.on('new message', (data) => {
      this.messages.push(data);
    })
  }

  sendMessage = (message: string) => {
    console.log(message)
    this.socket.emit('new message', message);
  }

  joinRoom = (id?: number, password?: string) => {
    this.socket.emit('join', { id: id, password: password });
  }

}
