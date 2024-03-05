import { Component, EventEmitter, Inject, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ChatService } from '../../../../services/chat-service'
import { RoomCreationState } from '../../../../models/ui.state'

@Component({
  standalone: true,
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RoomFormComponent {
  RoomCreationState = RoomCreationState
  formState: RoomCreationState

  roomName: string
  roomPassword: string
  roomCode: string
  error: string
  isPrivate: boolean

  @Output() createRoomEvent = new EventEmitter<void>()
  @Output() cancelEvent = new EventEmitter<void>()

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.formState = RoomCreationState.PUBLIC

    this.isPrivate = false
    this.roomName = ''
    this.roomCode = ''
    this.roomPassword = ''
    this.error = ''
  }

  submit (): void {
    if (this.roomName.trim().length === 0) {
      this.error = 'Room name is required'
      return
    }

    if (!this.isPrivate) {
      this.chatService.createRoom(this.roomName, this.roomPassword)
    } else {
      this.chatService.createPrivateRoom(this.roomName)
    }
    this.createRoomEvent.emit()

    this.error = ''
    this.roomName = ''
    this.roomPassword = ''
  }

  changeVisibilityType (type: RoomCreationState): void {
    if (this.formState !== type) {
      this.formState = type
      this.error = ''
    }
  }

  cancel (): void {
    this.cancelEvent.emit()
  }
}
