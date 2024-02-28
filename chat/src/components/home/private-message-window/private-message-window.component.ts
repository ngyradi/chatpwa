import { Component } from '@angular/core';
import { User } from '../../../models/chatroom';
import { ChatService } from '../../../services/chat-service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-private-message-window',
  templateUrl: './private-message-window.component.html',
  styleUrls: ['./private-message-window.component.css'],
  imports: [CommonModule]
})
export class PrivateMessageWindowComponent {

  privateMessageUser$: BehaviorSubject<User | undefined>;

  constructor(private readonly chatService: ChatService) {
    this.privateMessageUser$ = this.chatService.privateMessageUser$;
  }

  closeWindow() {
    this.chatService.closePrivateMessage();
  }

}
