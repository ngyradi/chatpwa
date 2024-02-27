import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';
import { User } from '../../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css'],
  imports: [CommonModule],
})
export class UserListItemComponent {

  @Input() user?: User;

  constructor() { }

}
