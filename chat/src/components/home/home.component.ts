import { type AfterViewInit, Component, HostListener, Inject } from '@angular/core'
import { RoomListComponent } from './room-list/room-list.component'
import { UserListComponent } from './user-list/user-list.component'
import { ChatWindowComponent } from './chat-window/chat-window.component'
import { CommonModule } from '@angular/common'
import { PageContainerComponent } from '../page-container/page-container.component'
import { ChatService } from '../../services/chat-service'
import { type BehaviorSubject } from 'rxjs'
import { Router, RouterLink, RouterModule } from '@angular/router'
import { UserService } from '../../services/user.service'
import { HomeFullComponent } from './home-full/home-full.component'
import { HomeMobileComponent } from './home-mobile/home-mobile.component'
import { type ChatState } from '../../models/ui.state'

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RoomListComponent, UserListComponent, ChatWindowComponent, PageContainerComponent, RouterModule, RouterLink, HomeFullComponent, HomeMobileComponent],
  providers: [ChatService]
})
export class HomeComponent implements AfterViewInit {
  public chatState$: BehaviorSubject<ChatState>

  innerWidth: number
  mobileWidth: number

  constructor (private readonly chatService: ChatService, @Inject(UserService) private readonly userService: UserService, @Inject(Router) private readonly router: Router) {
    this.chatState$ = this.chatService.chatState$

    this.innerWidth = window.innerWidth
    this.mobileWidth = 1024
  }

  ngAfterViewInit (): void {
    this.innerWidth = window.innerWidth
  }

  // Used to update the home screen
  // If the width is too small switch to a mobile home screen
  @HostListener('window:resize', ['$event'])
  onResize (event: any): void {
    this.innerWidth = window.innerWidth
  }

  getClientUserId (): string | undefined {
    return this.chatService.getSocketId()
  }

  logout (): void {
    this.chatService.destroyConnection()
    this.userService.logout()
  }
}
