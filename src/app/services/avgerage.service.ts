import { AverageObject } from './interfaces/average-object';
import { Measurement } from './interfaces/measurement';
import { StatisticsConfig } from './interfaces/statistics-config';

export class AvgerageService {

  private granularity: number;
  private window: number;
  private duration: number;
  private durationOffset: number;
  private durationStart: number;
  private durationEnd: number;

  constructor(config: StatisticsConfig) {
    this.granularity = config.granularity;
    this.window = config.window;
    this.durationOffset = config.durationOffset ? config.durationOffset : 0;
    this.duration = config.duration ? config.duration : config.window;
    this.durationStart = config.durationStart;
    this.durationEnd = config.durationEnd;
  }
  /**
     * 
     * @param data data
     * @returns the average over the duration and the average over the average
     */
  simpleAverage(data: Measurement[]): AverageObject {
    //return {avg: 0, usage: 0};
    const max = this.max(data, d => d.timestamp)
    let avg = this.calcAverage(data)

    avg = avg.filter(d => d.ts < max)
    if (this.durationStart) {
      avg = avg.filter(d => d.ts > this.durationStart)
    }

    data = data.filter(d => d.timestamp > (this.getStartOfDuration(max)))

    let avgAvg = this.round(avg.reduce((acc, curr) => acc += curr.avg, 0));
    let usage = this.round(data.reduce((acc, curr) => acc += curr.wh, 0));
    return { avg: avgAvg, usage };
  }

  max<T>(data: T[], fn: (d: T) => number) {
    return data.reduce((acc, curr) => acc = acc < fn(curr) ? fn(curr) : acc, 0);
  }
  min<T>(data: T[], fn: (d: T) => number) {
    return data.reduce((acc, curr) => acc = acc > fn(curr) ? fn(curr) : acc, Number.MAX_VALUE);
  }


  calcAverage(data: Measurement[]) {
    const max = data.reduce((acc, curr) => acc > curr.timestamp ? acc : curr.timestamp, 0)
    return Array.from(data.reduce((acc, curr) => {
      const interval = this.getIntervall(curr.timestamp);
      let entry = acc.get(interval);
      if (entry) {
        acc.set(interval, { wh: entry.wh + curr.wh, count: ++entry.count })
      } else {
        acc.set(interval, { count: 1, wh: curr.wh })
      }
      return acc;
    },
      new Map<number, { count: number, wh: number }>())
      .entries()).map(d => {
        return { ts: this.getDateFromInterval(d[0], max), wh: d[1].wh, avg: (d[1].wh / d[1].count), count: d[1].count, interval: d[0] }
      })
      .sort((a, b) => a.ts - b.ts)
  }


  calcExpandedAverage(data: Measurement[], max) {

    let average = this.calcAverage(data);

    var offset = 0;
    let orig = average;
    let window = this.window;

    max = this.durationEnd ? this.durationEnd : max;

    while (this.duration > offset * this.window) {
      orig.forEach(a => {
        let newA = { ts: this.getDateFromIntervalOffset(a.interval, offset, max), wh: a.wh, avg: a.avg, count: a.count, interval: a.interval }
        average.push(newA);
      });
      offset++;
      window = offset * this.window;
    }

    const start = this.getStartOfDuration(this.max(data, d => d.timestamp));
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
    if (this.durationStart) return this.durationStart;
    return ts - (ts % this.duration) + this.durationOffset
  }

  getDateFromInterval(interval: number, max: number) {
    return this.getStartOfWindow(max) + this.durationOffset + ((interval) * this.granularity)
  }

  getDateFromIntervalOffset(interval: number, offset: number, max: number) {
    return this.getDateFromInterval(interval, max) - this.window * offset;
  }


  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  private average<T>(data: T[], dataFn: (entry: T) => number): number {
    return data.reduce((acc, curr) => acc += (dataFn(curr) / data.length), 0);
  }

}
