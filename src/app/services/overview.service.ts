import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url:string) { }


  public getAll(participant: string): Observable<any> {
    return this._http.get(`${this._url}/overview/${participant}`);
  }
}
