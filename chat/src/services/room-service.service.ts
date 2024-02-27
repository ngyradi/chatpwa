import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client'
import { ChatRoom } from '../models/Chatroom';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);

  private socket: Socket;
  private readonly host = "http://localhost:3000";

  constructor() {
    this.socket = io(this.host)

    this.socket.on('connect', ()=>{
      this.getRooms();
    })

    this.socket.on('all rooms', (data:ChatRoom[])=>{
      console.log("received rooms");
      console.log(data)
      this.rooms$.next(data);
    })

    this.socket.on('new room', ()=>{
      this.getRooms();
    })
  }

  createRoom(name: string, password = "") {
    name = name.trim();
    if (name){
      this.socket.emit('new room', {name: name, password: password});
      console.log("create room")

    }
  }

  getRooms(){
    this.socket.emit('get rooms');
  }

}
