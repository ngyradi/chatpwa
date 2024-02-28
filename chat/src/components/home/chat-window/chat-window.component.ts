import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chatroom';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../services/chat-service';

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


  message: string;

  constructor(private readonly chatService: ChatService) {
    this.connected$ = this.chatService.connected$;
    this.messages = this.chatService.messages;
    this.message = "";
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = "";
    }
  }

  leaveRoom() {
    this.chatService.leaveRoom();
  }

}
