import { Component, OnDestroy } from '@angular/core';
import { RoomListComponent } from './room-list/room-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../page-container/page-container.component';
import { ChatService } from '../../services/chat-service';
import { ChatMessage, ChatRoom, User } from '../../models/Chatroom';
import { BehaviorSubject, Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RoomListComponent, UserListComponent, ChatWindowComponent, PageContainerComponent,RouterModule],
  providers: [ChatService],
})
export class HomeComponent implements OnDestroy{

  connected$ : BehaviorSubject<boolean>;
  rooms$ : BehaviorSubject<ChatRoom[]>;
  messages: ChatMessage[];
  users: BehaviorSubject<User[]>;
  connectedRoom$ : Subject<ChatRoom>;

  constructor(private readonly chatService: ChatService) {
    this.messages = this.chatService.messages;
    this.connected$ = this.chatService.connected$;
    this.rooms$ = this.chatService.rooms$;
    this.users = this.chatService.users$;
    this.connectedRoom$ = this.chatService.connectedRoom$;
  }
  ngOnDestroy(): void {
    this.chatService.destroyConnection();
  }

  joinRoom(room: ChatRoom) {
    this.chatService.joinRoom(room.id, room.password);
  }

  createRoom(room: ChatRoom) {
    if (room.name) {
      this.chatService.createRoom(room.name, room.password);
    }
  }

  sendMessage(message: string) {
    if ((message.trim())) {
      this.chatService.sendMessage(message);
    }
  }

  leaveRoom(){
    this.chatService.leaveRoom();
  }

}
