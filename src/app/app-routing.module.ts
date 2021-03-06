import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthService } from './services/auth.service';
import { TokenComponent } from './token/token.component';


const routes: Routes = [
  {path:'login', component: LoginComponent, },
  {path:'registration', component: RegistrationComponent, },
  {path:'registration/:active', component: RegistrationComponent, },
  {path:'overview/:participant', component: OverviewComponent, canActivate: [AuthService]},
  {path:'overview', component: OverviewComponent, canActivate: [AuthService]},
  {path:'profile', component: ProfileComponent, canActivate: [AuthService]},
  {path:'events', component: EventsComponent, canActivate: [AuthService]},
  {path:'events/:participant', component: EventsComponent, canActivate: [AuthService]},
  {path:'token/:tokenId', component: TokenComponent,},
  {path:'', redirectTo:'/overview', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
