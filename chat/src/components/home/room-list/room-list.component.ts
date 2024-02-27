import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { RoomService } from '../../../services/room-service.service';
import { ChatRoom } from '../../../models/Chatroom';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from '../../../services/chat-service';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  providers: [RoomService,ChatService],
  imports: [RoomFormComponent, RoomListItemComponent,CommonModule]
})
export class RoomListComponent  {

  public rooms$ = new BehaviorSubject<ChatRoom[]>([]);

  constructor(private readonly roomService: RoomService, private readonly chatService: ChatService) {
    this.rooms$ = this.roomService.rooms$;
  }

  joinRoom(room:ChatRoom){
    this.chatService.joinRoom(room.id, room.password);
  }

}
