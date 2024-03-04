import { Component, OnDestroy } from '@angular/core';
import { ChatMessage, User } from '../../../models/chatroom';
import { ChatService } from '../../../services/chat-service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-private-message-window',
  templateUrl: './private-message-window.component.html',
  styleUrls: ['./private-message-window.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PrivateMessageWindowComponent implements OnDestroy {

  pmUser?: User;
  userSubscription: Subscription;

  message: string;
  messages$ = new BehaviorSubject<ChatMessage[]>([]);

  constructor(private readonly chatService: ChatService) {
    this.message = "";
    this.userSubscription = this.chatService.privateMessageUser$.subscribe((val) => {
      this.pmUser = val;
      this.chatService.initPrivateMessages(val);
      this.messages$.next(this.chatService.getPrivateMessages(val) || [] as ChatMessage[])
    });

  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  closeWindow() {
    this.chatService.closePrivateMessage();
  }

  sendMessage() {
    if (this.pmUser) {
      this.chatService.sendPrivateMessage({ socketId: this.pmUser?.socketId, message: this.message })
      this.message = "";
    }
  }
}
