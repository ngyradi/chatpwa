import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { type ChatRoom, type ChatMessage } from '../../../models/chatroom'
import { type BehaviorSubject } from 'rxjs'
import { ChatService } from '../../../services/chat.service'
import { ChatMessageComponent } from './chat-message/chat-message.component'
import { WindowIconComponent } from '../window-icon/window-icon.component'
import { MessageAreaComponent } from './message-area/message-area.component'

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [CommonModule, ChatMessageComponent, WindowIconComponent, MessageAreaComponent]
})
export class ChatWindowComponent {
  connectedRoom$?: BehaviorSubject<ChatRoom | undefined>
  messages$: BehaviorSubject<ChatMessage[] | undefined>

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.connectedRoom$ = this.chatService.connectedRoom$
    this.messages$ = this.chatService.messages$
  }

  sendMessage (message: string): void {
    if (message.trim() !== undefined && message.length > 0) {
      this.chatService.sendMessage(message)
    }
  }

  leaveRoom (): void {
    this.chatService.leaveRoom()
  }
}
