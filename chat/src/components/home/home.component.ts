import { Component, OnInit } from '@angular/core';
import { RoomListComponent } from './room-list/room-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../page-container/page-container.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule,RoomListComponent,UserListComponent,ChatWindowComponent,PageContainerComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
