import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatAll, map } from 'rxjs/operators';
import { OverviewService } from '../services/overview.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  config = { granularity: 1000 * 60 * 30, duration: 1000 * 60 * 60 * 24 , durationOffset: 0 /*1000 * 60 * 60 * 24 * 4*/ }

  all$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => this._ov.getAll(p)),
    concatAll(),
    map(ms => ms.sort((a, b) => a.timestamp - b.timestamp))
  )

  lastWeek$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => this._ov.getLastWeek(p)),
    concatAll(),
    map(ms => ms.sort((a, b) => a.timestamp - b.timestamp))
  )

  today$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => this._ov.getToday(p)),
    concatAll(),
    map(ms => ms.sort((a, b) => a.timestamp - b.timestamp))
  )

  latest: { wh: number, timestamp: number };

  constructor(private _ov: OverviewService, private _route: ActivatedRoute) {
  }

  ngOnInit(): void {

  }

  getLatest() {
    this._route.params.pipe(
      map(param => param.participant),
      map(p => this._ov.getLatest(p)),
      concatAll(),
    )

  }

  configForToday() {
    this.config.duration = 1000 * 60 * 60 * 24;
    this.config.granularity = 1000 * 60 * 5;
    this.config.durationOffset = 0;
    console.log(this.config)
  }

}
