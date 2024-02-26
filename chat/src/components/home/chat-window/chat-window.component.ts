import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../models/Chatroom';
import { ChatService } from '../../../services/chat-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule,CommonModule],
  providers: [ChatService]
})
export class ChatWindowComponent {

  messages: string[];
  message: string;

  constructor(private readonly chatservice: ChatService) {
    this.messages = this.chatservice.messages;
    this.message = "";
  }

  sendMessage() {
    if ((this.message.trim())) {
      this.chatservice.sendMessage(this.message);
      console.log(this.message);
      this.message = "";
    }
  }

}
