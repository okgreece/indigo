/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input,  ElementRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery'
import * as _ from 'lodash';


@Component({
  selector: 'analytics-scatter-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./scatterPlot.html'),
  styles: [`

  
 .axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}



  `]
})
export class ScatterPlotVisualization extends AfterViewInit {
  get y_accessor(): string {
    return this._y_accessor;
  }
  @Input()
  set y_accessor(value: string) {
    this._y_accessor = value;
  }
  get x_accessor(): string {
    return this._x_accessor;
  }
  @Input()
  set x_accessor(value: string) {
    this._x_accessor = value;
  }
  get values(): any {
    return this._values;
  }


 private _x_accessor: string;
private _y_accessor: string;



  @Input()
  set values(value: any) {
    this._values = value;


    if (value)
      this.init(value);


    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {



  }


  @ViewChild('vizCanvas') vizCanvas: any;

  private _values: any;

  private generateBarChart(data: any) {

    let that = this;
    let margin = {top: 20, right: 40, bottom: 30, left: 100};


    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;




    let x = d3.scaleLinear().range([0, viewerWidth]);
    let y = d3.scaleLinear().range([viewerHeight, 0]);


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d[that._x_accessor]; }));
    y.domain([d3.min(data, function(d) { return d[that._y_accessor]; }), d3.max(data, function(d) { return d[that._y_accessor]; })]);



    // Add the scatterplot
    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) {
        return x(d[that._x_accessor]);
      })
      .attr("cy", function(d) { return y(
        d[that._y_accessor]);

      });

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + viewerHeight + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));



    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", viewerHeight)
      .attr("width", viewerWidth)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1");

    svg.append("svg:line")
      .attr("x1", 0)
      .attr("x2", viewerWidth)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .style("stroke", "black");








  }


  init(values: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html("");

    this.vizCanvas = this.elementRef;

    this.generateBarChart(values);


  }


  static type(d: any) {
    d.amount = +d.amount;
    return d;
  }


  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) {
    super();
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}
