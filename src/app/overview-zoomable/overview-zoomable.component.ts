import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Measurement } from '../services/interfaces/measurement';
import * as d3 from 'd3';

@Component({
  selector: 'app-overview-zoomable',
  templateUrl: './overview-zoomable.component.html',
  styleUrls: ['./overview-zoomable.component.scss']
})
export class OverviewZoomableComponent implements OnInit {


  @Input() data: Measurement[];


  constructor(public chartElem: ElementRef) { }

  ngOnInit(): void {

    const lastSunday = Date.now() - ((Date.now() - 1000 * 60 * 60 * 24 * 4) % (1000 * 60 * 60 * 24 * 7))
    this.data.push({ wh: 0, timestamp: lastSunday + (1000 * 60 * 60 * 24 * 7) })
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the SVG object to the body of the page
    var svg = d3.select("#dataviz_axisZoom")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleUtc()
      .domain(d3.extent(this.data, d => d.timestamp))
      .nice()
      .range([0, width]);

    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))


    // Add Y axis
    var y = d3.scalePow()
      .domain([0, d3.max<number>(this.data.map(d => d.wh))])
      .nice()
      .range([height, 0]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var bars = svg.append('g')
      .attr("clip-path", "url(#clip)")

    var color = (d: Measurement) => {
      return new Date(d.timestamp).getDay() % 2 ? '#6927FF' : '#AF0404'
    }

    bars
      .selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d: Measurement) => x(d.timestamp))
      .attr("y", (d: Measurement) => y(d.wh))
      .attr("width", width / this.data.length)
      .attr("height", (d) => height - y(d.wh))
      .style("fill", color)

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
      .scaleExtent([1, 25])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", (event, d) => updateChart(event, this.data));

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart(event, d) {

      // recover the new scale
      var newX = event.transform.rescaleX(x);
      // update axes with these new boundaries
      xAxis.call(d3.axisBottom(newX))
      // update circle position
      bars
        .selectAll("rect")
        .attr('x', (d: Measurement) => newX(d.timestamp))
        .attr("width", (width / d.length));
    }
  }
}