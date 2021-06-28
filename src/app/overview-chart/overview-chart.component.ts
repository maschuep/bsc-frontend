import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import * as d3 from 'd3';
import { AvgerageService } from '../services/avgerage.service';
import { Measurement } from '../services/interfaces/measurement';
import { StatisticsConfig } from '../services/interfaces/statistics-config';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements AfterViewInit, OnChanges {



  @Input() all: Measurement[];
  @Input() config: StatisticsConfig;
  data: Measurement[];

  private _avg: AvgerageService;

  average: { ts: number, avg: number, count: number }[];

  private _lg = 990;

  private _width = 700;
  private _height = 400;
  private _margin = 17;

  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;
  public barGroup;
  public zoom;

  constructor(public chartElem: ElementRef) { }

  ngOnChanges(changes: { config: SimpleChange, all: SimpleChange }) {

    if (this.data && this.average) {
      this.svg.remove();
      this.config = changes.config ? changes.config.currentValue : this.config;
      this.all = changes.all ? changes.all.currentValue : this.all;
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    const max = d3.max(this.all, d => d.timestamp);
    this._avg = new AvgerageService(this.config);
    this.data = this.all.filter(d => d.timestamp > (this._avg.getStartOfDuration(Date.now())))
    this.average = this._avg.calcExpandedAverage(this.all);

    this.initializeChart();
    this.drawChart();
  }

  initializeChart() {

    this.zoom = d3.zoom()
      .scaleExtent([1, 50])
      .extent([[0, 0], [this._width, this._height]])
      .on("zoom", (event, d) => this.onZoom(event, this.data, this.average));

    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this._height)
      .call(this.zoom);



    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this._margin + 'px, ' + this._margin + 'px) ')

    this.yScale = d3
      .scaleSqrt()
      .range([0, this._height - 2 * this._margin])
      .domain(this.getMinMax(this.data, this.average))
      .nice();

    this.xScale = d3.scaleTime().domain(d3.extent(this.average, d => d.ts)).nice();

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this._margin + 'px, 0)');
    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this._height - 2 * this._margin) + 'px) ');

    this.barGroup = this.svgInner.append('g')
      .style('transform', 'translate(' + 0 + 'px, ' + -1 * this._margin + 'px) ')
      .attr('id', 'bar');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', '#2a3cfa')
      .style('stroke-width', '2px');


    d3.select(window).on('resize', () => this.drawChart());
  }

  drawChart() {
    this._width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this._width);

    this.drawLabels();

    this.svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", this._width - 2 * this._margin)
      .attr("height", this._height)
      .style('transform', 'translate(' + this._margin + 'px, ' + -1 * this._margin + 'px) ')
      .attr("x", 0)
      .attr("y", 0);

    this.barGroup.attr("clip-path", "url(#clip)");
    this.lineGroup.attr("clip-path", "url(#clip)")

    this.xScale.range([this._margin, this._width - this._margin]);

    this.xAxis.call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));

    this.barGroup.selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d: Measurement) => this.xScale(d.timestamp))
      .attr("y", (d: Measurement) => this.yScale(d.wh) + this._margin)
      .attr("width", 1)
      .attr("height", (d) => (this._height) - this.yScale(d.wh))
      .style("fill", '#e7160f')
      .style("opacity", 0.99)

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);
    const points: [number, number][] = this.average.map(
      d => [this.xScale(d.ts), this.yScale(d.avg)]
    );
    this.lineGroup.attr('d', line(points));
  }

  onZoom(event, data: Measurement[], avg: { avg: number, ts: number, count: number }[]) {

    const newScale = event.transform.rescaleX(this.xScale);
    const yScale = this.yScale


    this.xAxis.call(d3.axisBottom(newScale));

    this.barGroup.selectAll('rect')
      .attr('x', (d: Measurement) => newScale(d.timestamp))
      .attr("width", 1);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);


    const points: [number, number][] = avg.map(
      d => [newScale(d.ts), yScale(d.avg)]
    );

    this.lineGroup.attr('d', line(points));

  }

  drawLabels() {
    if(this._width < this._lg) return;
    this.svg.append("text")
      .attr("transform",
        "translate(" + ((this._width + this._margin) / 2) + " ," +
        (this._height) + ")")
      .style("text-anchor", "middle")
      .text("Zeit");

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 + this._margin - 23)
      .attr("x", 0 - (this._height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Wattstunden (Wh)");
  }

  getMinMax(d: Measurement[], avg: { avg: number, ts: number, count: number }[]): number[] {
    let max = 0;
    let min = 100000000;
    d.forEach(b => {
      max = b.wh > max ? b.wh : max;
      min = b.wh < min ? b.wh : min;
    })
    avg.forEach(b => {
      max = b.avg > max ? b.avg : max;
      min = b.avg < min ? b.avg : min;
    })
    return [max, min]
  }

}