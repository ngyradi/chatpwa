import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';
import { RoomService } from '../../../services/room-service.service';
import { ChatRoom } from '../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  providers: [RoomService],
  imports: [RoomFormComponent, RoomListItemComponent,CommonModule]
})
export class RoomListComponent  {

  rooms : ChatRoom[];

  constructor(private readonly roomservice: RoomService) {
    this.rooms = this.roomservice.rooms;
  }

}
