import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string;
  password: string;

  pwType: string = 'password';

  mail: boolean = true;
  pwd: boolean = true;
  sucessful: boolean = true;


  constructor(private _loginService: LoginService, private _router:Router) { }

  login() {
    this.pwd = this.password?.length > 0;
    this.mail = this.username?.length > 0;
    if (this.mail && this.pwd){
      this._loginService.login(this.username, this.password).subscribe(()=> this._router.navigate(['/uebersicht']), (err)=> this.sucessful = false)
    }

  }

  viewPw(){
    this.pwType = this.pwType === 'text'  ? 'password' : 'text';
  }

}
  