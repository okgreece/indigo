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
import * as $ from 'jquery';
import * as _ from 'lodash';


@Component({
  selector: 'analytics-histogram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./histogram.html'),
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
export class HistogramVisualization extends AfterViewInit {
  get values(): any {
    return this._values;
  }

  @Input()
  set values(value: any) {
    this._values = value;

    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {

    if (this.values)
      this.init(this.values);

  }


  @ViewChild('vizCanvas') vizCanvas: any;

  private _values: any;
  @Input()
  public label_x: string;


  @Input()
  public label_y: string;
  private generateBarChart(data: any) {
    let margin = {top: 20, right: 40, bottom: 50, left: 50};


    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;


    let lineData = [];
    for(let i=0;i<data.cuts.length; i++){
      lineData.push({
        x: data.cuts[i],
        y: data["normal.curve"][i]
      });
    }

    let boxData = [];
    for(let i=0;i<data.counts.length; i++){
      boxData.push({
        from: data.cuts[i],
        to: data.cuts[i + 1],
        frequency : data.counts[i]
      });
    }

    debugger;


    let max = d3.max([d3.max(data.counts), d3.max(data["normal.curve"])]);
    let min = d3.min([d3.min(data.counts), d3.min(data["normal.curve"])]);

    let x_max = d3.max(data.cuts);
    let x_min = d3.min(data.cuts);

    let x = d3.scaleLinear()
      .range([0, viewerWidth]);

    let y = d3.scaleLinear()
      .range([viewerHeight, 0]);

    let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
      /*.tickFormat(function(d){
       return d3.time.format('%Y')(new Date(d));
       })*/;

    let yAxis = d3.axisLeft(y);


    let line = d3.line()
      .x(function (d: any) {
        return x(d.x);
      })
      .y(function (d: any) {
        return y(d.y);
      });

    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain([x_min, x_max]);

    y.domain([min, max]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + viewerHeight + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("dx", "-0.71em")
      .style("text-anchor", "end")
      .text("Amount");

    svg.append("path")
      .datum(lineData)
      .attr("class", "line")
      .attr("d", line);


    svg.selectAll(".box")
      .data(boxData)
      .enter().append("rect")
      .attr("class", "box")
      .attr("x", function(d:any) { return x(d.from); })
      .attr("y", function(d:any) { return y( 0); })
      .attr("width", function(d:any) { return x(Math.abs(d.to - d.from)); })
      .attr("height", function(d:any) { return y(d.frequency); });


   /* svg.append("path")
      .datum(_.filter(data, function (d) {
        return _.has(d, "low95")
      }))
      .attr("class", "lineLow95")
      .attr("d", lineLow95).attr("data-legend","Lower limit for 95% prediction interval");

*/
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

    svg.append("text")
      .attr("transform",
        "translate(" + (viewerWidth / 2) + " ," +
        (viewerHeight + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(this.label_x);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (viewerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label_y);



  }
  @Input()
  legend:boolean = false;


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
