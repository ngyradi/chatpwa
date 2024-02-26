import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.css'],
  imports: [CommonModule],
})
export class RoomListItemComponent {
  
  @Input() roomName: string;

  constructor() { 
    this.roomName = "";
  }

}
