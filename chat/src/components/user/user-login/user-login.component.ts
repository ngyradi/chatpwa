import { Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '../../page-container/page-container.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  imports: [PageContainerComponent, UserLoginFormComponent, RouterModule, RouterLink]
})
export class UserLoginComponent implements OnInit {

  constructor(private readonly userService: UserService) { }

  ngOnInit() {
    this.userService.logout();
  }

}
