import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client'
import { ChatRoom } from '../models/Chatroom';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public rooms: ChatRoom[];
  public socket: Socket;
  private readonly host = "http://localhost:4200";

  constructor() {
    this.rooms = [];
    this.socket = io(this.host)

    this.socket.on('new room', (data) => {
      this.rooms.push(data);
      console.log(this.rooms);
    })

    this.socket.on('all rooms', (data) => {
      this.rooms = data;
      console.log(`received all rooms`)
      console.log(this.rooms);
    })
  }

  createRoom(name: string, password: string) {
    this.socket.emit('create room', { name: name, password: password })
  }

  getRooms(){
    this.socket.emit('view rooms')
  }

}
