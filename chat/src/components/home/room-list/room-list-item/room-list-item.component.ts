import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { type ChatRoom } from '../../../../models/chatroom'
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RoomListItemComponent {
  @Input() selected?: number
  @Input() room?: ChatRoom
  @Output() joinRoomEvent = new EventEmitter<ChatRoom>()

  password: string
  inputVisible: boolean

  constructor () {
    this.inputVisible = false
    this.password = ''
  }

  joinRoom (): void {
    if (this.room !== undefined) {
      if (this.room.id !== this.selected && this.room.hasPassword === true) {
        this.inputVisible = true
      }
      this.joinRoomEvent.emit({ id: this.room.id, password: this.password })
    }
  }

  isConnectedRoom (): boolean {
    return this.selected === this.room?.id
  }
}
