import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../../services/room-service.service';
import { ChatRoom } from '../../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
  imports: [FormsModule],
  providers: [RoomService]
})
export class RoomFormComponent {

  roomName: string;
  roomPassword: string;

  error: string;

  constructor(private readonly roomService : RoomService) { 
    this.roomName = "";
    this.roomPassword = "";
    this.error = "";
  }

  submit(){
    if (!(this.roomName.trim())){
      this.error = "Room name is empty"
      return;
    }
    
    console.log(this.roomName, this.roomPassword);

    this.error = "";

    //create room
    this.roomService.createRoom(this.roomName,this.roomPassword);

    this.roomName = "";
    this.roomPassword = "";
  }

}
