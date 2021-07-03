import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from '../services/interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private _http: HttpClient, @Inject('BACKEND_URL') private _url: string) { }


  getAll(participant: string): Observable<Event[]>{
    return this._http.get<Event[]>(`${this._url}/event/${participant}`);
  }
  update(event: Event): Observable<any>{
    return this._http.patch(`${this._url}/event`, event);
  }
  
}
