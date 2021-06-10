import { Component, OnInit } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { concatAll, delay, map, tap } from 'rxjs/operators';
import { Measurement } from '../services/interfaces/measurement';
import { OverviewService } from '../services/overview.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  all$ = this._route.params.pipe(
    map(p => p.participant),
    map(p => this._ov.getLastWeek(p)),
    concatAll(),
  )

  latest: {wh: number, timestamp: number};


  constructor(private _ov: OverviewService, private _route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  getLatest(){
    this._route.params.pipe(
      map(param => param.participant),
      map( p=> this._ov.getLatest(p)),
      concatAll(),
      tap(console.log)
    )
    
  }

}
