import { GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css'],
  imports: [GoogleSigninButtonModule],
})
export class UserLoginFormComponent {

  user?: SocialUser

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {

  }

  logout() {
    this.userService.logout();
    //this.router.navigate(['']);
  }

}
