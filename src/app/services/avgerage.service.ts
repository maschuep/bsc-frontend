import { Optional } from '@angular/core';
import { AverageObject } from './interfaces/average-object';
import { Measurement } from './interfaces/measurement';
import { StatisticsConfig } from './interfaces/statistics-config';

export class AvgerageService {

  private granularity: number;
  private window: number;
  private duration: number;
  private durationOffset: number;

  constructor(config: StatisticsConfig) {
    this.granularity = config.granularity;
    this.window = config.window;
    this.durationOffset = config.durationOffset ? config.durationOffset : 0;
    this.duration = config.duration ? config.duration : config.window;
  }
  /**
     * 
     * @param data data
     * @returns the average over the duration and the average over the average
     */
  simpleAverage(data: Measurement[]): AverageObject {
    let avg = this.calcAverageInWindow(data)
    console.log(avg.length)
    avg = avg.filter(d => d.ts < Date.now())
    console.log(avg.length)
    data = data.filter(d => d.timestamp > (this.getStartOfDuration(Date.now())))
    let avgAvg = this.round(avg.reduce((acc, curr) => acc += curr.wh, 0));
    let usage = this.round(data.reduce((acc, curr) => acc += curr.wh, 0));
    return { avg: avgAvg, usage };
  }

  averageInPeriod(data: Measurement[]) {

  }

  calcAverageInWindow(data:Measurement[]){
    let intervalMap = new Map<number, { wh: number, count: number }>();
    data.forEach((d, i) => {
      let intervall = this.getIntervall(d.timestamp);
      let f = intervalMap.get(intervall);
      if (f) {
        f.wh += d.wh;
        f.count += 1;
        intervalMap.set(intervall, f)
      } else {
        intervalMap.set(intervall, { wh: d.wh, count: 1 })
      }
    })
    return Array.from(intervalMap.entries()).map(d => {
      return { ts: this.getDateFromInterval(d[0]), wh: d[1].wh, avg: (d[1].wh / d[1].count), count: d[1].count, interval: d[0] }
    })
    .sort((a,b)=> a.ts - b.ts)
  }


  calcExpandedAverage(data: Measurement[]) {
    
    let average = this.calcAverageInWindow(data);

    var offset = 0;
    let orig = average;
    let window = this.window;

    while (this.duration > offset * this.window) {
      orig.forEach(a => {
        let newA = { ts: this.getDateFromIntervalOffset(a.interval, offset), wh: a.wh, avg: a.avg, count: a.count, interval: a.interval }
        average.push(newA);
      });
      offset++;
      window = offset * this.window;
    }

    const start = this.getStartOfDuration(Date.now());
    return average.filter(a => a.ts > start).sort((a, b) => a.ts - b.ts);
  }

  getIntervall(ts: number) {
    return (this.currentInterval(ts) - this.getStartOfWindow(ts)) / this.granularity;
  }

  currentInterval(ts: number) {
    return ts - (ts % this.granularity)
  }

  getStartOfWindow(ts: number) {
    return ts - (ts % this.window)
  }

  getStartOfDuration(ts: number) {
    return ts - (ts % this.duration) + this.durationOffset
  }

  getDateFromInterval(interval: number) {
    return this.getStartOfWindow(Date.now()) + this.durationOffset + ((interval) * this.granularity)
  }

  getDateFromIntervalOffset(interval: number, offset: number) {
    //let a = ((Date.now() - 2*(1000 * 60 * 60 * 24 * 7) )- (Date.now() % (1000 * 60 * 60 * 24 * 7)) + (-1000 * 60 * 60 * 24 * 4)) + (0 * 1000 * 60 * 60)
    //let a = ((Date.now()-2*this.window) - (Date.now() % this.window) + this.durationOffset) + (interval * this.granularity)

    return this.getDateFromInterval(interval) - this.window * offset;
  }


  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  private average<T>(data: T[], dataFn: (entry: T) => number): number {
    return data.reduce((acc, curr) => acc += (dataFn(curr) / data.length), 0);
  }

}
