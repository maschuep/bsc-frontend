import { Component, Input, OnInit } from '@angular/core';
import { Measurement } from '../services/interfaces/measurement';
import * as d3 from 'd3';

@Component({
  selector: 'app-overview-zoomable',
  templateUrl: './overview-zoomable.component.html',
  styleUrls: ['./overview-zoomable.component.scss']
})
export class OverviewZoomableComponent implements OnInit {


  @Input() data: Measurement[];


  constructor() { }

  ngOnInit(): void {
    const lastSunday = Date.now() - ((Date.now() - 1000 * 60 * 60 * 24 * 4) % (1000 * 60 * 60 * 24 * 7))
    this.data.push({wh: 0, timestamp: lastSunday + (1000 * 60 * 60 * 24 * 7)})
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the SVG object to the body of the page
    var SVG = d3.select("#dataviz_axisZoom")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.timestamp))
      .range([0, width]);

    var xAxis = SVG.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 150])
      .range([height, 0]);
    var yAxis = SVG.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = SVG.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = SVG.append('g')
      .attr("clip-path", "url(#clip)")

    
    var color = (d: Measurement) => {
      return new Date(d.timestamp).getDay() % 2 ? 'red' : 'blue'
    }

    // Add circles
    scatter
      .selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d: Measurement) => x(d.timestamp))
      .attr("y", (d: Measurement) => y(d.wh))
      .attr("width", width / this.data.length)
      .attr("height", (d) => height - y(d.wh))
      .style("fill", color)
      .style("opacity", 0.5)

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
      .scaleExtent([.8, 25])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", (event, d) => updateChart(event, this.data));

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    SVG.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
    // now the user can zoom and it will trigger the function called updateChart

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart(event, d) {

      // recover the new scale
      var newX = event.transform.rescaleX(x);
      // update axes with these new boundaries
      xAxis.call(d3.axisBottom(newX))
      // update circle position
      console.log(event)
      scatter
        .selectAll("rect")
        .attr('x', (d: Measurement) => newX(d.timestamp))
        .attr("width", (width / d.length)+1)

    }
  }


}