import { Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '../../page-container/page-container.component';

@Component({
  standalone: true,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  imports: [PageContainerComponent]
})
export class UserLoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
