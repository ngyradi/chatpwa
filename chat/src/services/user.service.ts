import { SocialAuthService, type SocialUser } from '@abacritt/angularx-social-login'
import { Inject, Injectable, inject } from '@angular/core'
import { type CanActivateFn, Router, type UrlTree } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: SocialUser

  constructor (@Inject(SocialAuthService) private readonly authService: SocialAuthService, @Inject(Router) private readonly router: Router) {
    if (localStorage.getItem('user') !== undefined) {
      this.user = JSON.parse(localStorage.getItem('user') ?? '')
    }

    this.authService.authState.subscribe((user) => {
      this.user = user
      console.log(user)
      localStorage.setItem('user', JSON.stringify(user))
      if (user !== undefined) {
        this.router.navigate(['home'])
      }
    })
  }

  logout (): void {
    localStorage.removeItem('user')
    this.authService.signOut()
    this.router.navigate([''])
  }

  getUser (): SocialUser | undefined {
    return this.user
  }

  canActivate (): boolean | UrlTree {
    if (this.user !== undefined) {
      return true
    }

    return this.router.parseUrl('')
  }
}

export const canActivateHome: CanActivateFn = () => {
  return inject(UserService).canActivate()
}
