import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatAll, map } from 'rxjs/operators';
import { StatisticsConfig } from '../services/interfaces/statistics-config';
import { OverviewService } from '../services/overview.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  chartConfig: StatisticsConfig;
  numbersConfig: StatisticsConfig;

  all$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => {
      if (p) return p;
      const data = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      return data.participant;
    }),
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
    this.configForToday();
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
    this.chartConfig = { granularity: 1000 * 60 * 5, window: 1000 * 60 * 60 * 24, durationOffset: 0 }
    this.numbersConfig = { granularity: 1000 * 60 * 5, window: 1000 * 60 * 60 * 24, durationOffset: 0 };
  }

  configForThisWeek() {
    this.chartConfig = { granularity: 1000 * 60 * 5, window: 1000 * 60 * 60 * 24 * 7, durationOffset: 1000 * 60 * 60 * 24 * 4 }
    this.numbersConfig = { granularity: 1000 * 60 * 5, window: 1000 * 60 * 60 * 24 * 7, durationOffset: 1000 * 60 * 60 * 24 * 4 };
  }

  configForLastMonth() {
    this.chartConfig = { granularity: 1000 * 60 * 15, duration: 1000 * 60 * 60 * 24 * 31, window: 1000 * 60 * 60 * 24 * 7, durationOffset: 1000 * 60 * 60 * 24 * 4 }
    this.numbersConfig = { granularity: 1000 * 60, duration: 1000 * 60 * 60 * 24 * 31, window: 1000 * 60 * 60 * 24, durationOffset: 1000 * 60 * 60 * 24 * 4 }
  }

}
