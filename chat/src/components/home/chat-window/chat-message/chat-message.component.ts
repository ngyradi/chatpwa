import { Component, Input } from '@angular/core'
import { type ChatMessage } from '../../../../models/chatroom'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  imports: [CommonModule]
})
export class ChatMessageComponent {
  @Input() message?: ChatMessage
}
