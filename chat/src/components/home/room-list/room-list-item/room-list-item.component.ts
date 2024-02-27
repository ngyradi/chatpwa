import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatRoom } from '../../../../models/chatroom';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.css'],
  imports: [CommonModule, FormsModule],
})
export class RoomListItemComponent {

  @Input() selected?: boolean;
  @Input() room?: ChatRoom;
  @Output() joinRoomEvent = new EventEmitter<ChatRoom>();

  password: string;
  inputVisible: boolean;

  constructor() {
    this.inputVisible = false;
    this.password = "";
  }

  joinRoom() {
    if (this.room) {
      if (!this.room.public) {
        this.inputVisible = true;
      }
      this.joinRoomEvent.emit({ id: this.room.id, password: this.password })
    }
  }

}
