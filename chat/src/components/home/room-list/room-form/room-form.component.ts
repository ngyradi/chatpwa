import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../services/chat-service';

@Component({
  standalone: true,
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
  imports: [CommonModule, FormsModule],
})
export class RoomFormComponent {

  roomName: string;
  roomPassword: string;
  roomCode: string;
  error: string;
  isPrivate: boolean;


  @Output() createRoomEvent = new EventEmitter();

  constructor(private readonly chatService: ChatService) {
    this.isPrivate = false;
    this.roomName = "";
    this.roomCode = "";
    this.roomPassword = "";
    this.error = "";
  }

  submit() {
    if (!(this.roomName.trim())) {
      this.error = "Room name is empty"
      return;
    }

    if (!this.isPrivate) {
      this.chatService.createRoom(this.roomName, this.roomPassword);
    } else {
      this.chatService.createPrivateRoom(this.roomName);
    }
    this.createRoomEvent.emit();

    this.error = "";
    this.roomName = "";
    this.roomPassword = "";

  }

}
