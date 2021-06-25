import { Measurement } from './interfaces/measurement';

export class AvgerageService {

  constructor(private granularity: number, private duration: number, private durationOffset?: number) { }


  average(data: Measurement[]) {
    return data.reduce((acc, curr) => acc += curr.wh, 0) / data.length;
  }

  averageInPeriod(data: Measurement[]) {
    return data.reduce
  }

  calcAverage(data: Measurement[]) {
    let fiveMinMap = new Map<number, { avg: number, wh: number, count: number }>();
    data.forEach((d, i) => {
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
    return Array.from(fiveMinMap.entries()).map(d => {
      return { ts: this.getDateFromInterval(d[0]), avg: d[1].avg, count: d[1].count }
    })
      .sort((a, b) => a.ts - b.ts);
  }

  getIntervall(ts: number) {
    return (this.currentInterval(ts) - this.getStartOfDuration(ts)) / this.granularity;
  }

  currentInterval(ts: number) {
    return ts - (ts % this.granularity)
  }

  getStartOfDuration(ts: number) {
    return ts - (ts % this.duration)
  }

  getDateFromInterval(interval: number) {
    return this.getStartOfDuration(Date.now()) - this.durationOffset + (interval * this.granularity)
  }
}
