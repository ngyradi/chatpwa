import { Component, OnDestroy } from '@angular/core';
import { RoomListComponent } from './room-list/room-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../page-container/page-container.component';
import { ChatService } from '../../services/chat-service';
import { ChatRoom } from '../../models/chatroom';
import { Subject } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RoomListComponent, UserListComponent, ChatWindowComponent, PageContainerComponent, RouterModule, RouterLink],
})
export class HomeComponent implements OnDestroy {

  connectedRoom$: Subject<ChatRoom>;

  constructor(private readonly chatService: ChatService) {
    this.connectedRoom$ = this.chatService.connectedRoom$;
  }
  ngOnDestroy(): void {
    //this.chatService.destroyConnection();
  }

  getClientUserId() {
    return this.chatService.getSocketId();
  }

}
