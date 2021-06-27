import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthService } from './services/auth.service';


const routes: Routes = [
  {path:'login', component: LoginComponent, },
  {path:'registration', component: RegistrationComponent, },
  {path:'overview/:participant', component: OverviewComponent, canActivate: [AuthService]},
  {path:'overview', component: OverviewComponent, canActivate: [AuthService]},
  {path:'profil', component: ProfileComponent, canActivate: [AuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
