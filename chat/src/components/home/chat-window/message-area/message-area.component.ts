import { type AfterViewInit, Component, type ElementRef, type QueryList, ViewChild, ViewChildren, Input, Output, EventEmitter } from '@angular/core'
import { ChatMessageComponent } from '../chat-message/chat-message.component'
import { type BehaviorSubject } from 'rxjs'
import { type ChatMessage } from '../../../../models/chatroom'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  selector: 'app-message-area',
  templateUrl: './message-area.component.html',
  styleUrls: ['./message-area.component.css'],
  imports: [CommonModule, FormsModule, ChatMessageComponent]
})
export class MessageAreaComponent implements AfterViewInit {
  @Input() messages$?: BehaviorSubject<ChatMessage[] | undefined>
  @Input() infoMessage?: string
  @Output() sendMessageEvent = new EventEmitter<string>()

  // Used to scroll to the bottom when a message is added
  @ViewChildren('messages') messageElements!: QueryList<ChatMessageComponent>
  @ViewChild('scroller') content!: ElementRef

  message: string

  constructor () {
    this.message = ''
  }

  ngAfterViewInit (): void {
    this.scrollToBottom()
    this.messageElements.changes.subscribe(() => { this.scrollToBottom() })
  }

  sendMessage (): void {
    if (this.message.trim() !== undefined && this.message.length > 0) {
      this.sendMessageEvent.emit(this.message)
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
