import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url:string) {}

  public login(username: string, password: string): Observable<any>{
    return this._http.post<{userName: string, token: string}>(`${this._url}/user/login`, {mail:username,password}).pipe(
      tap(a => localStorage.setItem('token', a.token)),
    );
  }
}


