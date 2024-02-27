import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat-service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ChatWindowComponent {

  @Input() connected$ = new BehaviorSubject(false);
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
