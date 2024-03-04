import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user?: SocialUser;

  constructor(private readonly authService: SocialAuthService, private readonly router: Router) {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user') || "");
    }

    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      if (user) {
        this.router.navigate(['home'])
      }
    })
  }

  logout() {
    localStorage.removeItem('user');
    this.authService.signOut();
    this.router.navigate(['']);
  }

  canActivate(): boolean {
    if (this.user) {
      return true;
    }

    return false;
  }
}

export const canActivateHome: CanActivateFn = () => {
  return inject(UserService).canActivate();
}
