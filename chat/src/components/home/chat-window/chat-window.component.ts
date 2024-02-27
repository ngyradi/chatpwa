import { Component } from '@angular/core';
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
  providers: [ChatService]
})
export class ChatWindowComponent {

  public connected$ = new BehaviorSubject(false);

  messages: ChatMessage[];
  message: string;

  constructor(private readonly chatService: ChatService) {
    this.messages = this.chatService.messages;
    this.message = "";
    this.connected$ = this.chatService.connected$;
  }

  sendMessage() {
    if ((this.message.trim())) {
      this.chatService.sendMessage(this.message);
      console.log(this.message);
      this.message = "";
    }
  }

  join() {
    this.chatService.joinRoom();
  }

}
