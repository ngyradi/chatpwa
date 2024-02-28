import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { ChatRoom } from '../../../models/chatroom';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../services/chat-service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [RoomFormComponent, RoomListItemComponent, CommonModule, FormsModule]
})
export class RoomListComponent {

  rooms$?: BehaviorSubject<ChatRoom[]>;
  connectedRoom$?: BehaviorSubject<ChatRoom | undefined>;
  privateRoomCode$?: BehaviorSubject<string>;

  editing: boolean;
  joinCode: string;

  constructor(private readonly chatService: ChatService) {
    this.joinCode = "";
    this.rooms$ = this.chatService.rooms$;
    this.connectedRoom$ = this.chatService.connectedRoom$;
    this.editing = false;
    this.privateRoomCode$ = this.chatService.privateRoomCode$;
  }

  setEditingState(state: boolean) {
    this.editing = state;
  }

  joinRoom(room: ChatRoom) {
    this.chatService.joinRoom(room.id, room.password);
  }

  joinWithCode() {
    if (this.joinCode.trim()) {
      this.chatService.joinPrivateRoom(this.joinCode);
      this.joinCode = "";
    }
  }

}
