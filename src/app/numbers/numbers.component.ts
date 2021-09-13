import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { AvgerageService } from '../services/avgerage.service';
import { AverageObject } from '../services/interfaces/average-object';
import { Measurement } from '../services/interfaces/measurement';
import { StatisticsConfig } from '../services/interfaces/statistics-config';

@Component({
  selector: 'app-numbers',
  templateUrl: './numbers.component.html',
  styleUrls: ['./numbers.component.scss']
})
export class NumbersComponent implements OnChanges {


  @Input() all: Measurement[];
  @Input() config: StatisticsConfig;

  private _avg: AvgerageService;

  averages: AverageObject;
  change = 0;
  color = 'black';
  sign = '+';
  last;
  constructor() { }

  ngOnChanges(change: { config: SimpleChange, all: SimpleChange }): void {

    if (change.config) {
      this.config = change.config.currentValue
      this._avg = new AvgerageService(this.config);
    }
    if (change.all) {
      this.all = change.all.currentValue;
    }
    this.averages = this._avg.simpleAverage(this.all)
    this.change = this.round(100 * (this.averages.usage / this.averages.avg) - 100)
    this.color = this.change > 0 ? 'text-danger' : 'text-success';
    this.sign = this.change > 0 ? '+' : '';
    this.last = new Date(this._avg.max(this.all, d => d.timestamp));
  }


  round(nmbr: number) {
    return Math.round(nmbr * 10) / 10;
  }
}
