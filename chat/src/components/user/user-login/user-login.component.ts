import { Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '../../page-container/page-container.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';

@Component({
  standalone: true,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  imports: [PageContainerComponent,UserLoginFormComponent]
})
export class UserLoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
