import { CommonModule } from '@angular/common'
import { Component, Inject, Input } from '@angular/core'
import { UserListItemComponent } from './user-list-item/user-list-item.component'
import { type BehaviorSubject } from 'rxjs'
import { type PrivateMessage, type User } from '../../../models/chatroom'
import { ChatService } from '../../../services/chat-service'

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule, UserListItemComponent]
})
export class UserListComponent {
  users?: BehaviorSubject<User[]>
  @Input() clientUserId?: string

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.users = this.chatService.users$
  }

  sendPrivateMessage (pm: PrivateMessage): void {
    this.chatService.sendPrivateMessage(pm)
  }
}
