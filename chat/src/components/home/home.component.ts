import { Component } from '@angular/core';
import { RoomListComponent } from './room-list/room-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../page-container/page-container.component';
import { ChatService } from '../../services/chat-service';
import { ChatRoom, User } from '../../models/chatroom';
import { BehaviorSubject } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';
import { PrivateMessageWindowComponent } from './private-message-window/private-message-window.component';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RoomListComponent, UserListComponent, ChatWindowComponent, PageContainerComponent, RouterModule, RouterLink, PrivateMessageWindowComponent],
  providers: [ChatService],
})
export class HomeComponent {

  connectedRoom$: BehaviorSubject<ChatRoom | undefined>;
  public privateMessageUser$: BehaviorSubject<User | undefined>;

  constructor(private readonly chatService: ChatService, private readonly userService: UserService) {
    this.privateMessageUser$ = this.chatService.privateMessageUser$;
    this.connectedRoom$ = this.chatService.connectedRoom$;
  }

  getClientUserId() {
    return this.chatService.getSocketId();
  }

  logout() {
    this.chatService.exit();
    this.userService.logout();
  }

}
