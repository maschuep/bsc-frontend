import { MapType } from '@angular/compiler';
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


  average(data: Measurement[]) {
    return data.reduce((acc, curr) => acc += curr.wh, 0) / data.length;
  }

  averageInPeriod(data: Measurement[]) {
    return data.reduce
  }

  calcAverage(data: Measurement[]) {
    let max = data[data.length - 1].timestamp;
    let min = Date.now();
    let fiveMinMap = new Map<number, { avg: number, wh: number, count: number }>();
    data.forEach((d, i) => {
      max = d.timestamp > max ? d.timestamp : max;
      min = d.timestamp < min ? d.timestamp : min;
      let intervall = this.getIntervall(d.timestamp);
      let f = fiveMinMap.get(intervall);
      if (f) {
        f.wh += d.wh;
        f.count += 1;
        f.avg = f.wh / f.count;
        fiveMinMap.set(intervall, f)
      } else {
        fiveMinMap.set(intervall, { wh: d.wh, avg: d.wh, count: 1 })
      }
    })
    let average = Array.from(fiveMinMap.entries()).map(d => {
      return { ts: this.getDateFromInterval(d[0]), avg: d[1].avg, count: d[1].count, interval: d[0] }
    })

    var offset = 1;
    let orig = average;
    let window = this.window;

    while (this.duration >  offset * this.window) {
      orig.forEach(a => {
        let newA = { ts: this.getDateFromIntervalOffset(a.interval, offset), avg: a.avg, count: a.count, interval: a.interval }
        average.push(newA);
      });
      offset++;
      window = offset * this.window;
    }
    
    const start = this.getStartOfDuration(max);
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


}
