import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Inject, Input, type OnDestroy, Output } from '@angular/core'
import { RoomListComponent } from '../room-list/room-list.component'
import { ChatWindowComponent } from '../chat-window/chat-window.component'
import { UserListComponent } from '../user-list/user-list.component'
import { PageContainerComponent } from '../../page-container/page-container.component'
import { type BehaviorSubject, type Subscription } from 'rxjs'
import { type User } from '../../../models/chatroom'
import { MobileHamburgerMenuButtonComponent } from './mobile-hamburger-menu-button/mobile-hamburger-menu-button.component'
import { MobileHamburgerMenuComponent } from './mobile-hamburger-menu/mobile-hamburger-menu.component'
import { ChatState, PageState } from '../../../models/ui.state'
import { ChatService } from '../../../services/chat.service'
import { PrivateMessageWindowComponent } from '../chat-window/private-message-window/private-message-window.component'
import { ChatPlaceholderComponent } from '../chat-window/chat-placeholder/chat-placeholder.component'

@Component({
  standalone: true,
  selector: 'app-home-mobile',
  templateUrl: './home-mobile.component.html',
  styleUrls: ['./home-mobile.component.css'],
  imports: [CommonModule, RoomListComponent, ChatWindowComponent, PrivateMessageWindowComponent, UserListComponent, PageContainerComponent, MobileHamburgerMenuButtonComponent, MobileHamburgerMenuComponent, ChatPlaceholderComponent]
})
export class HomeMobileComponent implements OnDestroy {
  ChatState = ChatState
  PageState = PageState

  @Input() chatState$?: BehaviorSubject<ChatState>
  @Input() clientUserId: string | undefined
  @Output() logoutEvent = new EventEmitter<void>()

  privateMessageUser: User | undefined
  isMenuOpen: boolean
  selectedPage: PageState

  chatStateSubscription: Subscription

  constructor (@Inject(ChatService) private readonly chatService: ChatService) {
    this.isMenuOpen = false
    this.selectedPage = PageState.ROOMS

    // Switch to the chat page when joining a room or starting a private message
    this.chatStateSubscription = this.chatService.chatState$.subscribe((state) => {
      switch (state) {
        case ChatState.ROOM:{
          this.selectedPage = PageState.CHAT
          break
        }
        case ChatState.PRIVATE:{
          this.selectedPage = PageState.CHAT
          break
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.chatStateSubscription.unsubscribe()
  }

  logout (): void {
    this.logoutEvent.emit()
  }

  toggleMenu (): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  changePage (page: PageState): void {
    this.selectedPage = page
  }
}
