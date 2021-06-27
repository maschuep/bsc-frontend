import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  profile$ = this._us.profile(JSON.parse(atob(localStorage.getItem('token').split('.')[1])).mail)

  constructor(private _us: UserService) { }

  ngOnInit(): void {
    
  }

}
