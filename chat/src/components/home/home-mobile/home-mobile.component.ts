import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RoomListComponent } from '../room-list/room-list.component'
import { ChatWindowComponent } from '../chat-window/chat-window.component'
import { PrivateMessageWindowComponent } from '../private-message-window/private-message-window.component'
import { UserListComponent } from '../user-list/user-list.component'
import { PageContainerComponent } from '../../page-container/page-container.component'
import { type BehaviorSubject } from 'rxjs'
import { type User } from '../../../models/chatroom'
import { MobileHamburgerMenuButtonComponent } from './mobile-hamburger-menu-button/mobile-hamburger-menu-button.component'
import { MobileHamburgerMenuComponent } from './mobile-hamburger-menu/mobile-hamburger-menu.component'

@Component({
  standalone: true,
  selector: 'app-home-mobile',
  templateUrl: './home-mobile.component.html',
  styleUrls: ['./home-mobile.component.css'],
  imports: [CommonModule, RoomListComponent, ChatWindowComponent, PrivateMessageWindowComponent, UserListComponent, PageContainerComponent, MobileHamburgerMenuButtonComponent, MobileHamburgerMenuComponent]
})
export class HomeMobileComponent {
  @Input() privateMessageUser$?: BehaviorSubject<User | undefined>
  @Input() clientUserId: string | undefined
  @Output() logoutEvent = new EventEmitter<void>()

  isMenuOpen: boolean

  constructor () {
    this.isMenuOpen = false
  }

  logout (): void {
    this.logoutEvent.emit()
  }

  openMenu (): void {
    this.isMenuOpen = !this.isMenuOpen
  }
}
