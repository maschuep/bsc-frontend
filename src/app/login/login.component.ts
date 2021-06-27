import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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


  constructor(private _loginService: UserService, private _router:Router) { }

  login() {
    this.pwd = this.password?.length > 0;
    this.mail = this.username?.length > 0;
    if (this.mail && this.pwd){
      this._loginService.login(this.username, this.password)
      .subscribe((ans)=> {
        this.sucessful = true; 
        this._router.navigate([`/overview/${ans.participant}`])}, 
        (err)=> this.sucessful = false)
    }

  }

  viewPw(){
    this.pwType = this.pwType === 'text'  ? 'password' : 'text';
  }

}
  