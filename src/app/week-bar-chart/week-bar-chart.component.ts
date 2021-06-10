import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Measurement } from '../services/interfaces/measurement';

@Component({
  selector: 'app-week-bar-chart',
  templateUrl: './week-bar-chart.component.html',
  styleUrls: ['./week-bar-chart.component.scss']
})
export class WeekBarChartComponent implements OnInit {

  private sunday = Date.now() - ((Date.now() - 1000 * 60 * 60 * 24 * 4) % (1000 * 60 * 60 * 24 * 7));
  private week = 1000 * 60 * 60 * 24 * 7;
  @Input() data: Measurement[];

  private svg;
  private margin = 100;
  private width = 1500 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  private maxWh;


  constructor() {

  }

  ngOnInit(): void {
    this.data = this.data.sort((a, b) => a.timestamp - b.timestamp)
    this.maxWh = this.data.reduce((acc, curr) => acc > curr.wh ? acc : curr.wh, 0)
    this.createSvg();
    this.drawBars(this.data);
  }

  private createSvg(): void {

    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    
    
  }
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleUtc()
      .range([0, this.width])
      .domain(d3.extent(data, d => d.date))


    console.log(d3.axisBottom(x).tickValues())


    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")


    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, this.maxWh])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    const valueline = d3.line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveMonotoneX);
    //create line
    this.svg.selectAll("bars")
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

    // Create and fill   the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.wh))
      .attr("width", this.width / data.length)
      .attr("height", (d) => this.height - y(d.wh))
      .attr("fill", "#d04a35")

  }
}
