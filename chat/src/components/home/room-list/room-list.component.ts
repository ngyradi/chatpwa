import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { ChatRoom } from '../../../models/chatroom';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChatService } from '../../../services/chat-service';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [RoomFormComponent, RoomListItemComponent, CommonModule]
})
export class RoomListComponent {

  rooms$?: BehaviorSubject<ChatRoom[]>;
  connectedRoom$?: Subject<ChatRoom>;

  editing: boolean;

  constructor(private readonly chatService: ChatService) {
    this.rooms$ = this.chatService.rooms$;
    this.connectedRoom$ = this.chatService.connectedRoom$;
    this.editing = false;
  }

  setEditingState(state: boolean) {
    this.editing = state;
  }

  joinRoom(room: ChatRoom) {
    this.chatService.joinRoom(room.id, room.password);
  }

  createRoom(room: ChatRoom) {
    if (room.name) {
      this.editing = false;
      this.chatService.createRoom(room.name, room.password);
    }
  }

}
