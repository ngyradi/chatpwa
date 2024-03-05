import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RoomListComponent } from '../room-list/room-list.component'
import { ChatWindowComponent } from '../chat-window/chat-window.component'
import { PrivateMessageWindowComponent } from '../chat-window/private-message-window/private-message-window.component'
import { UserListComponent } from '../user-list/user-list.component'
import { CommonModule } from '@angular/common'
import { type BehaviorSubject } from 'rxjs'
import { type User } from '../../../models/chatroom'
import { PageContainerComponent } from '../../page-container/page-container.component'

@Component({
  standalone: true,
  selector: 'app-home-full',
  templateUrl: './home-full.component.html',
  styleUrls: ['./home-full.component.css'],
  imports: [CommonModule, RoomListComponent, ChatWindowComponent, PrivateMessageWindowComponent, UserListComponent, PageContainerComponent]
})
export class HomeFullComponent {
  @Input() privateMessageUser$?: BehaviorSubject<User | undefined>
  @Input() clientUserId: string | undefined
  @Output() logoutEvent = new EventEmitter<void>()

  logout (): void {
    this.logoutEvent.emit()
  }
}
