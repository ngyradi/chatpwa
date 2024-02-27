import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { ChatMessage } from '../models/Chatroom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //public messages: string[]
  public messages: ChatMessage[];
  public connected;
  public socket : Socket;

  public connected$ = new BehaviorSubject(false);

  private readonly host = "http://localhost:3000";

  constructor() { 
    this.connected$.next(false);
    this.connected = false;
    this.messages = [];
    this.socket = io(this.host);

    this.socket.on('joined', (data) => {
      this.connected = true;
      this.connected$.next(true);
      console.log("connected");
    })

    this.socket.on('new message',(data) => {
      this.messages.push(data);
      console.log(this.messages);
    })
  }

  sendMessage = (message: string) => {
    if (message && this.connected) {
      this.socket.emit('new message', message);
    }
  }

  joinRoom = () => {
    this.socket.emit('join');
  }

}
