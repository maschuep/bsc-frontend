import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url: string) { }

  public login(username: string, password: string): Observable<any> {
    return this._http.post<{ token: string }>(`${this._url}/user/login`, { mail: username, password }).pipe(
      tap(a => localStorage.setItem('token', a.token)),
    );
  }

  public register(user: { mail: string, password: string, phone: string, participant: string }): Observable<any> {
    return this._http.post<{ userName: string, token: string }>(`${this._url}/user/register`, { ...user }).pipe(
      tap(a => localStorage.setItem('token', a.token)),
    );
  }

  public profile(username: string){
    return this._http.get(`${this._url}/user`)
  }

  public checkForMail(mail: string):Observable<boolean> {
    return this._http.get<{ message: string }>(`${this._url}/user/exists/${mail}`).pipe(
      tap(),
      map(ans => ans.message === 'exists'),
    )
  }
}


