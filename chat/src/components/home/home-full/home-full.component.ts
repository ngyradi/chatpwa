import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RoomListComponent } from '../room-list/room-list.component'
import { ChatWindowComponent } from '../chat-window/chat-window.component'
import { UserListComponent } from '../user-list/user-list.component'
import { CommonModule } from '@angular/common'
import { type BehaviorSubject } from 'rxjs'
import { PageContainerComponent } from '../../page-container/page-container.component'
import { ChatState } from '../../../models/ui.state'
import { PrivateMessageWindowComponent } from '../chat-window/private-message-window/private-message-window.component'
import { ChatPlaceholderComponent } from '../chat-window/chat-placeholder/chat-placeholder.component'

@Component({
  standalone: true,
  selector: 'app-home-full',
  templateUrl: './home-full.component.html',
  styleUrls: ['./home-full.component.css'],
  imports: [CommonModule, RoomListComponent, ChatWindowComponent, PrivateMessageWindowComponent, UserListComponent, PageContainerComponent, ChatPlaceholderComponent]
})
export class HomeFullComponent {
  ChatState = ChatState
  @Input() chatState$?: BehaviorSubject<ChatState>
  @Input() clientUserId: string | undefined
  @Output() logoutEvent = new EventEmitter<void>()

  logout (): void {
    this.logoutEvent.emit()
  }
}
