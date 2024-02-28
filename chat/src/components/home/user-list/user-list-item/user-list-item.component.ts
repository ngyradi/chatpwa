import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../../../models/chatroom';
import { ChatService } from '../../../../services/chat-service';

@Component({
  standalone: true,
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css'],
  imports: [CommonModule],
})
export class UserListItemComponent {

  @Input() isSelf: boolean;
  @Input() user?: User;

  constructor(private readonly chatService: ChatService) {
    this.isSelf = false;
  }

  sendPrivateMessage() {
    if (this.user) {
      //this.privateMessageEvent.emit({ socketId: this.user.socketId, message: "asdasd" })
      this.chatService.sendPrivateMessage({ socketId: this.user.socketId, message: "test" });
    }
  }

}
