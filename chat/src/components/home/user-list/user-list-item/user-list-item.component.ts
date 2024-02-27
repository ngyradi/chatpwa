import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { PrivateMessage, User } from '../../../../models/chatroom';

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
  @Output() privateMessageEvent = new EventEmitter<PrivateMessage>();

  constructor() {
    this.isSelf = false;
  }

  sendPrivateMessage() {
    if (this.user) {
      this.privateMessageEvent.emit({ socketId: this.user.socketId, message: "asdasd" })
    }
  }

}
