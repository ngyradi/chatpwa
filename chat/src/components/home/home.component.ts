import { Component } from '@angular/core';
import { RoomListComponent } from './room-list/room-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../page-container/page-container.component';
import { ChatService } from '../../services/chat-service';
import { ChatMessage, ChatRoom, User } from '../../models/Chatroom';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RoomListComponent, UserListComponent, ChatWindowComponent, PageContainerComponent],
  providers: [ChatService],
})
export class HomeComponent {

  connected$ = new BehaviorSubject(false);
  rooms$ = new BehaviorSubject<ChatRoom[]>([]);
  messages: ChatMessage[];
  users: BehaviorSubject<User[]>;

  constructor(private readonly chatService: ChatService) {
    this.messages = this.chatService.messages;
    this.connected$ = this.chatService.connected$;
    this.rooms$ = this.chatService.rooms$;
    this.users = this.chatService.users$;
  }

  joinRoom(room: ChatRoom) {
    this.chatService.joinRoom(room.id, room.password);
    console.log(room)
  }

  createRoom(room: ChatRoom) {
    if (room.name) {
      this.chatService.createRoom(room.name, room.password);
    }
  }

  sendMessage(message: string) {
    if ((message.trim())) {
      this.chatService.sendMessage(message);
      console.log(message);
    }
  }

}
