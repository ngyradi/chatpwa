import { type Routes } from '@angular/router'
import { HomeComponent } from '../components/home/home.component'
import { UserLoginComponent } from '../components/user/user-login/user-login.component'
import { canActivateHome } from '../services/user.service'

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [canActivateHome] },
  { path: '', component: UserLoginComponent },
  { path: '**', component: UserLoginComponent }
]
