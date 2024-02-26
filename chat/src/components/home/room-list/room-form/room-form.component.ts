import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
  imports: [FormsModule],
})
export class RoomFormComponent {

  roomName: string;
  roomPassword: string;

  error: string;

  constructor() { 
    this.roomName = "";
    this.roomPassword = "";
    this.error = "";
  }

  submit(){
    if (!(this.roomName.trim())){
      this.error = "Room name is empty"
      return;
    }
    
    this.error = "";

    //create room

    this.roomName = "";
    this.roomPassword = "";
  }

}
