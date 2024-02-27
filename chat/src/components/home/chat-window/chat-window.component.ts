import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatMessage, ChatRoom } from '../../../models/Chatroom';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ChatWindowComponent {

  @Input() connectedRoom$? : Subject<ChatRoom>;
  @Output() sendMessageEvent = new EventEmitter<string>();
  @Input() messages: ChatMessage[];

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

}
