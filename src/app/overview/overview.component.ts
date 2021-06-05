import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    map(p => this._ov.getAll(p)),
    delay(5000),
    concatAll(),
    tap(console.log)
  )

  constructor(private _ov: OverviewService, private _route: ActivatedRoute) { }

  ngOnInit(): void {

    
  }

}
