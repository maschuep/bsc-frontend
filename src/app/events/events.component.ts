import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { concatAll, map, tap } from 'rxjs/operators';
import { EventService } from '../services/event.service';
import { Event } from '../services/interfaces/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  //tabs: new, common, categorized (better word) events
  //make at least a badge for new

  new: Event[];
  often: Event[];
  all: Event[];
  reasons: string[];



  event$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => {
      if (p) return p;
      const data = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      return data.participant;
    }),
    map(p => this._es.getAll(p)),
    concatAll(),
    tap(all => this.new = all.filter(a => !a.reason)),
    tap(all => this.often = this.reduceToOften(all)),
    tap(data => this.all = data),
    tap(dat => this.reasons = Array.from(dat.filter(a => a.reason).reduce((acc,curr) => acc.set(curr.reason, curr.reason) ,new Map<string,string>()).keys())),
  )

  constructor(private _es: EventService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  save(event: Event) {
    this.new = this.new.filter(n => n.eventId !== event.eventId)
    this.often = this.reduceToOften(this.all)
    this._es.update(event).subscribe()
  }

  reduceToOften(all: Event[]): Event[] {
    return Array.from(
      all.filter(a => a.reason)
        .reduce((acc, curr) => {
          let event = acc.get(curr.reason)
          if (event) {
            event.count += 1;
            acc.set(event.reason, event);
          } else {
            acc.set(curr.reason, { ...curr, count: 1 })
          }
          return acc
        },
          new Map<string, Event>()).entries()
    )
      .map(d => { return { ...d[1] } })
      .sort((a, b) => b.count - a.count)


  }

}
