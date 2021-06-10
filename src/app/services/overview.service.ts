import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url:string) { }

  public getAll(participant: string): Observable<any> {
    return this._http.get(`${this._url}/overview/${participant}`);
  }

  public getLastWeek(participant: string): Observable<any> {
    return this._http.get(`${this._url}/overview/lastweek/${participant}`);
  }

  getLatest(participant: string): Observable<{wh:number, timestamp:number}>{
    return this._http.get<{wh:number, timestamp:number}[]>(`${this._url}/overview/latest/${participant}`)
    .pipe(map(la => la[0]));
  }

}
