import { type AfterViewInit, Component, type ElementRef, Inject, type QueryList, ViewChild, ViewChildren } from '@angular/core'
import { CommonModule } from '@angular/common'
import { type ChatRoom, type ChatMessage } from '../../../models/chatroom'
import { type BehaviorSubject } from 'rxjs'
import { ChatService } from '../../../services/chat-service'
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
export class ChatWindowComponent implements AfterViewInit {
  connectedRoom$?: BehaviorSubject<ChatRoom | undefined>
  messages$: BehaviorSubject<ChatMessage[] | undefined>

  @ViewChildren('messages') messageElements!: QueryList<ChatMessageComponent>
  @ViewChild('scroller') content!: ElementRef

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.connectedRoom$ = this.chatService.connectedRoom$
    this.messages$ = this.chatService.messages$

    this.connectedRoom$.subscribe((asd) => { console.log(asd) })
  }

  ngAfterViewInit (): void {
    this.messageElements.changes.subscribe(() => { this.scrollToBottom() })
  }

  sendMessage (message: string): void {
    if (message.trim() !== undefined && message.length > 0) {
      this.chatService.sendMessage(message)
    }

    this.scrollToBottom()
  }

  leaveRoom (): void {
    this.chatService.leaveRoom()
  }

  scrollToBottom (): void {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight
    } catch (err) {}
  }
}
