import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url:string) {   }

  public login(username: string, password: string): Observable<any>{
    return this._http.post(`${this._url}/user/login`, {mail:username,password})
  }
}
