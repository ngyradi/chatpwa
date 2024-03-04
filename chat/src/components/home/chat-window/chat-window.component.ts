import { type AfterViewInit, Component, type ElementRef, Inject, Input, type QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { type ChatMessage } from '../../../models/chatroom'
import { type BehaviorSubject } from 'rxjs'
import { ChatService } from '../../../services/chat-service'
import { ChatMessageComponent } from './chat-message/chat-message.component'

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule, CommonModule, ChatMessageComponent]
})
export class ChatWindowComponent implements AfterViewInit {
  @Input() connectedRoomName?: string
  @Input() messages: ChatMessage[]
  @Input() connected$?: BehaviorSubject<boolean>

  @ViewChildren('messages') messageElements!: QueryList<any>
  @ViewChild('scroller') content!: ElementRef

  message: string

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.connected$ = this.chatService.connected$
    this.messages = this.chatService.messages
    this.message = ''
  }

  ngAfterViewInit (): void {
    this.messageElements.changes.subscribe(() => { this.scrollToBottom() })
  }

  sendMessage (): void {
    if (this.message.trim() !== undefined && this.message.length > 0) {
      this.chatService.sendMessage(this.message)
      this.message = ''
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
