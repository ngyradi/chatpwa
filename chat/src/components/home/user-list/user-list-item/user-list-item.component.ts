import { CommonModule } from '@angular/common'
import { Component, Inject, Input } from '@angular/core'
import { type User } from '../../../../models/chatroom'
import { ChatService } from '../../../../services/chat.service'

@Component({
  standalone: true,
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css'],
  imports: [CommonModule]
})
export class UserListItemComponent {
  @Input() isSelf: boolean
  @Input() user?: User

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.isSelf = false
  }

  sendPrivateMessage (): void {
    if (this.user !== undefined) {
      this.chatService.selectPrivateMessageUser(this.user)
    }
  }
}
