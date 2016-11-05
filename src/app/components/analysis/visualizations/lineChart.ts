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
  selector: 'analytics-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./lineChart.html'),
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

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.lineUp80 {
  fill: none;
  stroke: orange;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}
.lineUp95 {
  fill: none;
  stroke: green;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}


.lineLow95 {
  fill: none;
  stroke: green;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}
.lineLow80 {
  fill: none;
  stroke: orange;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}



  `]
})
export class LineChartVisualization extends AfterViewInit {
  get values(): any {
    return this._values;
  }
  @Input()
  set values(value: any) {
    debugger;
    this._values = value;


    if(value)
    this.init(value);


    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {

    let that = this;


  }



  @ViewChild('vizCanvas') vizCanvas:any;
  @Input() values$: Observable<any>;
 private _values: any;

  private generateBarChart(data: any) {
    let margin = {top: 20, right: 40, bottom: 30, left: 150};



    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;


    let amounts=_.flatten(data.map(function (d:any) {
      let values = [(d.amount)];
      if(_.has(d,"up80")) values.push((d.up80));
      if(_.has(d,"up95")) values.push((d.up95));
      if(_.has(d,"low80")) values.push((d.low80));
      if(_.has(d,"low95")) values.push((d.low95));
      return values;

    }));

    let max =1.1* d3.max(amounts);
    let min = (1-(0.1*Math.sign(d3.min(amounts))))* d3.min(amounts);




    let x = d3.scaleLinear()
      .range([0, viewerWidth]);

    let y = d3.scaleLinear()
      .range([viewerHeight, 0]);

    let xAxis = d3.axisBottom(x).
      tickFormat(d3.format("d"))
      /*.tickFormat(function(d){
        debugger;
        return d3.time.format('%Y')(new Date(d));
      })*/;

    let yAxis = d3.axisLeft(y);


    let line = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.amount); });

    let lineUp80 = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.up80); });
    let lineUp95 = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.up95); });
    let lineLow80 = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.low80); });
    let lineLow95 = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.low95); });

    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      x.domain(d3.extent(data, function(d:any) { return d.year; }));
      y.domain([min,max]);

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
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


    svg.append("path")
      .datum(_.filter(data, function(d){return _.has(d,"up80")}) )
      .attr("class", "lineUp80")
      .attr("d", lineUp80);

  svg.append("path")
      .datum(_.filter(data, function(d){return _.has(d,"up95")}) )
      .attr("class", "lineUp95")
      .attr("d", lineUp95);


  svg.append("path")
      .datum(_.filter(data, function(d){return _.has(d,"low80")}) )
      .attr("class", "lineLow80")
      .attr("d", lineLow80);


  svg.append("path")
      .datum(_.filter(data, function(d){return _.has(d,"low95")}) )
      .attr("class", "lineLow95")
      .attr("d", lineLow95);


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
      .attr("y2",y(0))
      .style("stroke", "black");


  }

  parseTime = d3.timeParse("y");

  init(values: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html("");

    this.vizCanvas = this.elementRef;

    this.generateBarChart(values);




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
