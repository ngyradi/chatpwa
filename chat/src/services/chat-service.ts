import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: string[]

  connected = true;
  public socket : Socket;

  constructor() { 
    this.messages = [];
    this.socket = io("http://localhost:4200");

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

}
