import { GoogleSigninButtonModule, type SocialUser } from '@abacritt/angularx-social-login'
import { Component, Inject } from '@angular/core'
import { UserService } from '../../../../services/user.service'

@Component({
  standalone: true,
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css'],
  imports: [GoogleSigninButtonModule]
})
export class UserLoginFormComponent {
  user?: SocialUser

  constructor (@Inject(UserService) private readonly userService: UserService) { }

  logout (): void {
    this.userService.logout()
  }
}
