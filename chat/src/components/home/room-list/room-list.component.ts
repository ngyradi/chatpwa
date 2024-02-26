import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [CommonModule],
})
export class RoomListComponent implements OnInit {

  private room_name: string;
  private room_password: string;

  constructor() {
    this.room_name = "";
    this.room_password = "";
  }

  ngOnInit() {
  }

  createRoom() {

  }

}
