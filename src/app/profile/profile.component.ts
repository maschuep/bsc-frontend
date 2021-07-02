import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile;
  origProfile;

  profile$ = this._us.profile()
    .pipe(
      tap((p:any) => delete p.password),
      tap(p => this.profile = p),
      tap(p => this.saveOriginal())
    );

  mailExists: boolean = false;

  mail;
  phone;
  participant;

  constructor(private _us: UserService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.initialValues();
  }

  update() {
    this._us.update(this.profile);
  }

  saveOriginal() {
    this.mail = this.profile.mail;
    this.phone = this.profile.phone;
    this.participant = this.profile.participant;
  }

  initialValues() {
    this.profile.mail = this.mail;
    this.profile.phone = this.phone;
    this.profile.participant = this.participant;
  }

  validMail():boolean{
    return this.mail?.length >= 3;
  }

  checkMail() {
    if (this.validMail() && this.profile.mail !== this.mail) {
      this._us.checkForMail(this.mail).pipe(tap(valid => this.mailExists = valid)).subscribe()
    }
  }
}
