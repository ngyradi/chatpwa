import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { ChatMessage, ChatRoom } from '../models/Chatroom';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: ChatMessage[];
  public connectedRoom?: ChatRoom;
  public connected$ = new BehaviorSubject(false);
  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);

  private socket: Socket;

  private readonly host = "http://localhost:3000";

  constructor() {
    this.messages = [];
    this.connected$.next(false);
    

    this.socket = io(this.host);

    this.socket.on('connect', ()=>{
      this.getRooms();
    })

    this.socket.on('all rooms', (data:ChatRoom[])=>{
      this.rooms$.next(data);
    })

    this.socket.on('new room', ()=>{
      this.getRooms();
    })

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

  createRoom(name: string, password = "") {
    name = name.trim();
    if (name){
      this.socket.emit('new room', {name: name, password: password});
    }
  }

  getRooms(){
    this.socket.emit('get rooms');
  }

}
