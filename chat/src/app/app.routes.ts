import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { UserLoginComponent } from '../components/user/user-login/user-login.component';

export const routes: Routes = [
    {path: 'login', component: UserLoginComponent},
    {path: '**', component: HomeComponent},
];
