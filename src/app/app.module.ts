import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverviewComponent } from './overview/overview.component';
import { BearerAuthInterceptor } from './services/bearer-auth.interceptor';
import { RegistrationComponent } from './registration/registration.component';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    RegistrationComponent,
    OverviewChartComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: 'BACKEND_URL', useValue: "http://bsc-api.maschuep.ch" },
    { provide: HTTP_INTERCEPTORS, useClass: BearerAuthInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
