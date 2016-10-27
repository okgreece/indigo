/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import {Observable} from "rxjs";
import * as $ from 'jquery'
import * as _ from 'lodash';

import {Store} from "@ngrx/store";

@Component({
  selector: 'analytics-acf-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./acfChart.html'),
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

.interval {
  fill: none;
  stroke: blue;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 
}




  `]
})
export class AcfChartVisualization extends AfterViewInit {
  get data(): any {
    return this._data;
  }
  @Input()
  set data(value: any) {
    debugger;
    this._data = value;


    if(value)
    this.init(value);


    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {

    let that = this;


  }



  @ViewChild('vizCanvas') vizCanvas:any;
 private _data: any;

  private generateBarChart(data: any) {
    let margin = {top: 10, right: 10, bottom: 35, left: 35};



    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;
    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let lags = data.values.map(function (d:any) {
      return d["lag"];

    });

    let correlations = data.values.map(function (d:any) {
      return d["correlation"];

    });

    let allYs = correlations.map(function (c:any) {
      return Math.abs(c);
    }); //clone
    allYs.push(Math.abs(data.interval_up));
    allYs.push(Math.abs(data.interval_low));

    let max = 1.1*d3.max(allYs);




    let x = d3.scale.ordinal()
      .rangeRoundBands([0, viewerWidth], 1-(1/correlations.length));

    let y = d3.scale.linear()
      .range([viewerHeight, 0]);




    let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.format("d"));

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");



    x.domain(data.values.map(function (d:any) {
      return d["lag"]
    }));
    y.domain([-max, max]);




    svg.html("");
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + viewerHeight + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".31em")
      .style("text-anchor", "end");

    svg.selectAll(".bar")
      .data(data.values)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "black")
      .attr("x", function (d:any) {
        return x(d["lag"]);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d:any) {
        if (d.correlation > 0){
          return y(d.correlation);
        } else {
          return y(0);
        }



      })
      .attr("height", function (d:any) {
        return Math.abs(y(d.correlation) - y(0));      });


    svg.append("svg:line")
      .attr("x1", 0)
      .attr("x2", viewerWidth)
      .attr("y1", y(data.interval_up))
      .attr("y2", y(data.interval_up))
      .attr("class", "interval");

    svg.append("svg:line")
      .attr("x1", 0)
      .attr("x2", viewerWidth)
      .attr("y1", y(data.interval_low))
      .attr("y2", y(data.interval_low))
      .attr("class", "interval");

    svg.append("svg:line")
      .attr("x1", 0)
      .attr("x2", viewerWidth)
      .attr("y1", y(0))
      .attr("y2",y(0))
      .style("stroke", "black");


    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", viewerHeight)
      .attr("width", viewerWidth)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1");

   /* let line = d3.svg.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.amount); });

    let lineUp80 = d3.svg.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.up80); });
    let lineUp95 = d3.svg.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.up95); });
    let lineLow80 = d3.svg.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.low80); });
    let lineLow95 = d3.svg.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.low95); });*/




  }

  parseTime = d3.time.format("y");

  init(data: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html("");

    this.vizCanvas = this.elementRef;

    this.generateBarChart(data);




  }




  type(d:any) {
  d.amount = +d.amount;
  return d;
  }


  constructor( private elementRef: ElementRef,       private ref: ChangeDetectorRef) {
    super();
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}
