import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { AvgerageService } from '../services/avgerage.service';
import { Measurement } from '../services/interfaces/measurement';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {



  @Input() all: Measurement[];
  @Input() config: { granularity: number, duration: number, durationOffset: number };
  data: Measurement[];

  private _avg: AvgerageService;

  average: { ts: number, avg: number, count: number }[];

  private _width = 700;
  private _height = 400;
  private _margin = 10;

  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;
  public barGroup;

  constructor(public chartElem: ElementRef) {
  }

  ngOnInit(): void {
    this._avg = new AvgerageService(this.config.granularity, this.config.duration, 0);
    this.data = this.all.filter(d => d.timestamp > (Date.now() - this.config.duration))
    this.average = this._avg.calcAverage(this.all);
    console.log([new Date(this.average[0].ts), new Date(this.average[this.average.length - 1].ts)], [new Date(this.data[0].timestamp), new Date(this.data[this.data.length - 1].timestamp)])
    this.initializeChart();
    this.drawChart();

  }

  /*ngOnChanges(changes): void {
    console.log(changes)
    this.initializeChart();
    this.drawChart();
  }*/ 

  initializeChart() {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this._height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', `translate(+${this._margin}px,  ${this._margin}px)`)

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(this.average, d => d.avg), d3.min(this.average, d => d.avg)])
      .nice()
      .range([0, this._height - 2 * this._margin]);

    this.xScale = d3.scaleUtc().domain(d3.extent(this.average, d => d.ts)).nice();

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', `translate(+${this._margin}px, 0)`);
    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', `translate(0,${this._height - 2 * this._margin}px)`);

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', '2px');

    this.barGroup = this.svgInner.append('g')
      .attr('id', 'bar');
  }

  drawChart() {
    this._width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this._height = this.chartElem.nativeElement.getBoundingClientRect().height;
    console.log(this._width)
    this.svg.attr('width', this._width);

    this.xScale.range([this._margin, this._width - 2 * this._margin]);
    const xAxis = d3
      .axisBottom(this.xScale);
    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);
    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);
    const points: [number, number][] = this.average.map(
      d => [this.xScale(d.ts), this.yScale(d.avg)]
    );
    this.lineGroup.attr('d', line(points));

    /*this.barGroup.selectAll("rect")
       .data(this.data)
       .enter()
       .append("rect")
       .attr("x", (d: Measurement) => this.xScale(d.timestamp))
       .attr("y", (d: Measurement) => this.yScale(d.wh))
       .attr("width", this._width / this.data.length)
       .attr("height", (d) => this._height - this.yScale(d.wh))
       .attr('transform', 'translate(' +this._margin + ',' + this._margin + ')')
       .style("fill", 'blue')
       .style("opacity", 0.5)*/
  }

}