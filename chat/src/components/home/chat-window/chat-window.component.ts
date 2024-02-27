import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/Chatroom';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ChatWindowComponent {

  @Input() connectedRoomName?: string;
  @Input() messages: ChatMessage[];
  @Input() connected$?: BehaviorSubject<boolean>;

  @Output() sendMessageEvent = new EventEmitter<string>();
  @Output() leaveRoomEvent = new EventEmitter<void>();

  message: string;

  constructor() {
    this.messages = [];
    this.message = "";
  }

  sendMessage() {
    if (this.message.trim()) {
      this.sendMessageEvent.emit(this.message)
      this.message = "";
    }
  }

  leaveRoom() {
    this.leaveRoomEvent.emit();
  }

}
