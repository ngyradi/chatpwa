import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core'
import { type ChatRoom } from '../../../../models/chatroom'
import { FormsModule } from '@angular/forms'
import { type BehaviorSubject } from 'rxjs'
import { ChatService } from '../../../../services/chat-service'
@Component({
  standalone: true,
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RoomListItemComponent {
  selected?: boolean // todo
  connectedRoom$: BehaviorSubject<ChatRoom | undefined> //dont open password input if same room


  @Input() room?: ChatRoom
  @Output() joinRoomEvent = new EventEmitter<ChatRoom>()

  password: string
  inputVisible: boolean

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.connectedRoom$ = this.chatService.connectedRoom$
    this.inputVisible = false
    this.password = ''
  }

  joinRoom (): void {
    if (this.room !== undefined) {
      if (this.room.hasPassword === true) {
        this.inputVisible = true
      }
      this.joinRoomEvent.emit({ id: this.room.id, password: this.password })
    }
  }
}
