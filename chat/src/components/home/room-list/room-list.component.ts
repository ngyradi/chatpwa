import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoomFormComponent } from './room-form/room-form.component';
import { RoomListItemComponent } from './room-list-item/room-list-item.component';

@Component({
  standalone: true,
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [CommonModule,RoomFormComponent, RoomListItemComponent],
})
export class RoomListComponent {

  constructor() {

  }

}
