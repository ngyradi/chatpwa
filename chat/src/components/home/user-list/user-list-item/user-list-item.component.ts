import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css'],
  imports: [CommonModule],
})
export class UserListItemComponent {

  @Input() username?: string;

  constructor() { }

}
