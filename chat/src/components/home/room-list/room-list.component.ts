import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { ChatRoom } from '../../../models/Chatroom';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../services/chat-service';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  providers: [ChatService],
  imports: [RoomFormComponent, RoomListItemComponent,CommonModule]
})
export class RoomListComponent  {

  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);

  constructor(private readonly chatService: ChatService) {
    this.rooms$ = this.chatService.rooms$;
  }

  joinRoom(room:ChatRoom){
    this.chatService.joinRoom(room.id, room.password);
  }

}
