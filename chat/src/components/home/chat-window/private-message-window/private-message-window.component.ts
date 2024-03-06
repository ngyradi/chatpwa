import { Component, Inject, type OnDestroy } from '@angular/core'
import { type ChatMessage, type User } from '../../../../models/chatroom'
import { ChatService } from '../../../../services/chat-service'
import { BehaviorSubject, type Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ChatMessageComponent } from '../chat-message/chat-message.component'
import { WindowIconComponent } from '../../window-icon/window-icon.component'
import { MessageAreaComponent } from '../message-area/message-area.component'

@Component({
  standalone: true,
  selector: 'app-private-message-window',
  templateUrl: './private-message-window.component.html',
  styleUrls: ['./private-message-window.component.css'],
  imports: [CommonModule, FormsModule, ChatMessageComponent, WindowIconComponent, MessageAreaComponent]
})
export class PrivateMessageWindowComponent implements OnDestroy {
  pmUser?: User

  // Used to update the messages
  userSubscription: Subscription

  message: string
  messages$ = new BehaviorSubject<ChatMessage[] | undefined>([])

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.message = ''
    this.userSubscription = this.chatService.privateMessageUser$.subscribe((val) => {
      this.pmUser = val

      // Initialize the array if it doesn't exist so the observable can update when we receive a message
      this.chatService.initPrivateMessages(val)
      this.messages$.next(this.chatService.getPrivateMessages(val) ?? [] as ChatMessage[])
    })
  }

  ngOnDestroy (): void {
    this.userSubscription.unsubscribe()
  }

  closeWindow (): void {
    this.chatService.closePrivateMessage()
  }

  sendMessage (message: string): void {
    if (this.pmUser !== undefined) {
      this.chatService.sendPrivateMessage({ socketId: this.pmUser?.socketId, message })
    }
  }
}
