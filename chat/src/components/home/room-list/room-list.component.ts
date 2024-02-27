import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { ChatRoom } from '../../../models/Chatroom';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [RoomFormComponent, RoomListItemComponent,CommonModule]
})
export class RoomListComponent  {

  @Input() rooms$? : BehaviorSubject<ChatRoom[]>;
  @Input() connectedRoom$? : Subject<ChatRoom>;

  @Output() joinRoomEvent = new EventEmitter<ChatRoom>();
  @Output() createRoomEvent = new EventEmitter<ChatRoom>();

  constructor() {
  }

  joinRoom(room:ChatRoom){
    this.joinRoomEvent.emit({id: room.id, password: room.password})
  }

  createRoom(room:ChatRoom){
    this.createRoomEvent.emit(room);
  }

}
