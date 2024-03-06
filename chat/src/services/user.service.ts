import { SocialAuthService, type SocialUser } from '@abacritt/angularx-social-login'
import { Inject, Injectable, inject } from '@angular/core'
import { type CanActivateFn, Router, type UrlTree } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: SocialUser

  constructor (@Inject(SocialAuthService) private readonly authService: SocialAuthService, @Inject(Router) private readonly router: Router) {
    this.authService.authState.subscribe((user) => {
      this.user = user
      this.router.navigate(['home'], { onSameUrlNavigation: 'reload' })
    })
  }

  // After logging out redirect to the sign in page
  logout (): void {
    this.authService.signOut().then(() => {
      this.router.navigate([''])
    })
  }

  getUser (): SocialUser | undefined {
    return this.user
  }

  // Create a username from the users first and last name
  // Handle if the user doesn't have a last name
  getUsername (): string | undefined {
    let name
    if (this.user !== undefined) {
      name = this.user?.firstName
      if (this.user.lastName?.length > 0) {
        name += ' ' + this.user.lastName
      }
    }
    return name
  }

  // Home page route guard
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
