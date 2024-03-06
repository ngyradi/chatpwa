import { Component, Inject, type OnInit } from '@angular/core'
import { PageContainerComponent } from '../../page-container/page-container.component'
import { RouterLink, RouterModule } from '@angular/router'
import { UserService } from '../../../services/user.service'
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login'

@Component({
  standalone: true,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  imports: [PageContainerComponent, RouterModule, RouterLink, GoogleSigninButtonModule]
})
export class UserLoginComponent implements OnInit {
  constructor (@Inject(UserService) private readonly userService: UserService) { }

  ngOnInit (): void {
    this.userService.logout()
  }
}
