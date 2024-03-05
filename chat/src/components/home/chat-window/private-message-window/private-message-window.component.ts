import { type AfterViewInit, Component, type ElementRef, Inject, type QueryList, ViewChild, ViewChildren, type OnDestroy } from '@angular/core'
import { type ChatMessage, type User } from '../../../../models/chatroom'
import { ChatService } from '../../../../services/chat-service'
import { BehaviorSubject, type Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ChatMessageComponent } from '../chat-message/chat-message.component'
import { WindowIconComponent } from '../../window-icon/window-icon.component'

@Component({
  standalone: true,
  selector: 'app-private-message-window',
  templateUrl: './private-message-window.component.html',
  styleUrls: ['./private-message-window.component.css'],
  imports: [CommonModule, FormsModule, ChatMessageComponent, WindowIconComponent]
})
export class PrivateMessageWindowComponent implements OnDestroy, AfterViewInit {
  pmUser?: User
  userSubscription: Subscription

  message: string
  messages$ = new BehaviorSubject<ChatMessage[]>([])

  @ViewChildren('messages') messageElements!: QueryList<ChatMessageComponent>
  @ViewChild('scroller') content!: ElementRef

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.message = ''
    this.userSubscription = this.chatService.privateMessageUser$.subscribe((val) => {
      this.pmUser = val
      this.chatService.initPrivateMessages(val)
      this.messages$.next(this.chatService.getPrivateMessages(val) ?? [] as ChatMessage[])
    })
  }

  ngAfterViewInit (): void {
    this.messageElements.changes.subscribe(() => { this.scrollToBottom() })
  }

  ngOnDestroy (): void {
    this.userSubscription.unsubscribe()
  }

  closeWindow (): void {
    this.chatService.closePrivateMessage()
  }

  sendMessage (): void {
    if (this.pmUser !== undefined) {
      this.chatService.sendPrivateMessage({ socketId: this.pmUser?.socketId, message: this.message })
      this.message = ''
    }
    this.scrollToBottom()
  }

  scrollToBottom (): void {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight
    } catch (err) {}
  }
}
