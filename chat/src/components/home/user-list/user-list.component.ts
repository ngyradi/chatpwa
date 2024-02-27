import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserListItemComponent } from './user-list-item/user-list-item.component';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule,UserListItemComponent],
})
export class UserListComponent {

  @Input() users?: BehaviorSubject<User[]>;

  constructor() {}

}
