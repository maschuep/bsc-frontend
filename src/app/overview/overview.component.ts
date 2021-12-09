import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatAll, map } from 'rxjs/operators';
import { StatisticsConfig } from '../services/interfaces/statistics-config';
import { OverviewService } from '../services/overview.service';
import { UserService } from '../services/user.service';

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
    this.chartConfig = { granularity: 1000 * 60, window: 1000 * 60 * 60 * 24, durationOffset: 0 }
    this.numbersConfig = { ...this.chartConfig, duration: this.chartConfig.window };
  }

  configForThisWeek() {
    this.chartConfig = { granularity: 1000 * 60 * 15, window: 1000 * 60 * 60 * 24 * 7, durationOffset: - 4 * 1000 * 60*60*24}
    this.numbersConfig = { duration: this.chartConfig.window, ...this.chartConfig, granularity: 1000 * 60, };
  }

  /*configForThisWeek() {
    const today = new Date();
    const first = new Date(today.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((today.valueOf() - first.valueOf()) / (24 * 60 * 60 * 1000))
    const res = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);
    const offset = res % 2 === 1 ? 1000 * 60 * 60 * 24 * 4 : 1000 * 60 * 60 * 24 * 3;
    this.chartConfig = { granularity: 1000 * 60 * 5, window: 1000 * 60 * 60 * 24 * 7, durationOffset: offset }
    this.numbersConfig = { duration: this.chartConfig.window, ...this.chartConfig, granularity: 1000 * 60, };
  }*/

  configForLastMonth() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1, 2);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    this.chartConfig = { granularity: 1000 * 60 * 60 * 3, duration: end.valueOf() - start.valueOf(), durationStart: start.valueOf(), durationEnd: end.valueOf(), window: 1000 * 60 * 60 * 24 * 7, durationOffset: -1000 * 60 * 60 * 24 * 3 }
    this.numbersConfig = { granularity: 1000 * 60, durationStart: start.valueOf(), durationEnd: end.valueOf(), window: 1000 * 60 * 60 * 24 * 7, durationOffset: -1000 * 60 * 60 * 24 * 3 }
  }

}