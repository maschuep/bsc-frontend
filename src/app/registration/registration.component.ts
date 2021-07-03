import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  possibleParticipant$ = this._http.get(`${this._url}/measurement/participants`)

  pw1Type = "password"
  pw2Type = "password"
  minPasswordLength = 3;

  mail: string;
  password1: string;
  password2: string;

  phone: string ;
  participant: string;
  participantId: string;

  mailExists: boolean = false;
  validMail: boolean = true;
  validPw: boolean = true;
  validPhone: boolean = true;
  validParticipant: boolean = true;

  //make table participant which specifies how much people, square feet, type of heating,
  /*
  falls participant daten nicht erfasst das noch tun und dann anmelden
  */


  constructor(
    private _userService: UserService,
    private _router: Router,
    private _http: HttpClient,
    @Inject('BACKEND_URL') private _url: string
  ) { }
  
  ngOnInit(): void {
  }

  checkMail(){
    if (this.valMail()) {
      this._userService.checkForMail(this.mail).pipe(tap(valid => this.mailExists = valid)).subscribe()
    }
  }

  valMail() {
   return this.mail?.length >= 3;
  }


  valPhone() {
    this.phone.trim()
    this.phone = this.phone.split(' ').reduce((acc,curr) => acc+= curr, '');
    this.phone = this.phone.charAt(0) === '0' ? this.phone.substring(1) : this.phone
    this.validPhone = this.phone?.length === 9;
  }
  valParticipant() {
    this.validParticipant = this.participantId?.length > 0;
  }
  passwordsMatch() {
    this.validPw = this.password1?.length < this.minPasswordLength
      || this.password2?.length < this.minPasswordLength
      || this.password1 === this.password2
  }

  valPwd() {
    this.validPw = this.password1?.length > 0;
  }

  togglePw(id: string) {
    if ("pw1" === id) {
      this.pw1Type = this.pw1Type === "text" ? "password" : "text";
    } else {
      this.pw2Type = this.pw2Type === "text" ? "password" : "text";
    }
  }

  register() {
    this.validMail = this.valMail();
    this.valPwd();
    this.valPhone();
    this.valParticipant();
    if (
      this.validMail
      && this.validPw
      && this.validPhone
      && this.validParticipant
      && !this.mailExists
    ) {
      this._userService.register({
        mail: this.mail,
        password: this.password1,
        phone: `+41${this.phone}`,
        participant: this.participantId
      })
        .subscribe(ans => {
          this._router.navigate([`/overview`])
        })
    }

  }

  checkForParticipant(e: string, p: string[]) {

    p.forEach(part => {

      if (part.toLowerCase() === e.toLowerCase()) {
        this.participantId = e.toLowerCase();
      }
    })
    this.valParticipant()
  }

}
