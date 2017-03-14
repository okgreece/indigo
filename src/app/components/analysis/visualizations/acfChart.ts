/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild, Injector
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import {Observable} from "rxjs";
import * as $ from 'jquery'
import * as _ from 'lodash';

import {Store} from "@ngrx/store";
import {AnalysisVisualization} from "../visualization";

@Component({
  selector: 'analytics-acf-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './acfChart.html',
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
export class AcfChartVisualization extends AnalysisVisualization implements AfterViewInit {
  get data(): any {
    return this._data;
  }

  @Input()
  set data(value: any) {
    this._data = value;
    if (this._data && this.initialized)
      this.init(this._data);

    this.ref.detectChanges();
  }

  initialized: boolean = false;

  ngAfterViewInit(): void {

    this.initialized = true;
    if (this._data)
      this.init(this.data);
  }

  @Input()
  public label_x: string;


  @Input()
  public label_y: string;

  @ViewChild('vizCanvas') vizCanvas: any;
  private _data: any;

  private generateBarChart(data: any) {
    let margin = {top: 10, right: 10, bottom: 35, left: 45};


    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;
    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let lags = data.values.map(function (d: any) {
      return d["lag"];

    });

    let correlations = data.values.map(function (d: any) {
      return d["correlation"];

    });

    let allYs = correlations.map(function (c: any) {
      return Math.abs(c);
    }); //clone
    allYs.push(Math.abs(data.interval_up));
    allYs.push(Math.abs(data.interval_low));

    let max = 1.1 * d3.max(allYs);


    let x = d3.scaleBand()
      .rangeRound([0, viewerWidth])
      .padding(0.9 + (0.001 * correlations.length));

    let y = d3.scaleLinear()
      .range([viewerHeight, 0]);


    let xAxis = d3.axisBottom(x);

    let yAxis = d3.axisLeft(y)
      ;


    x.domain(data.values.map(function (d: any) {
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
      .attr("x", function (d: any) {
        return x(d["lag"]);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d: any) {
        if (d.correlation > 0) {
          return y(d.correlation);
        } else {
          return y(0);
        }


      })
      .attr("height", function (d: any) {
        return Math.abs(y(d.correlation) - y(0));
      });


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
      .attr("y2", y(0))
      .style('stroke', 'black');


    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", viewerHeight)
      .attr("width", viewerWidth)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1");


    svg.append("text")
      .attr("transform",
        "translate(" + (viewerWidth / 2) + " ," +
        (viewerHeight + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text(this.label_x);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (viewerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(this.label_y);

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


  init(data: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

//    this.vizCanvas = this.elementRef;

    this.generateBarChart(data);


  }


  type(d: any) {
    d.amount = +d.amount;
    return d;
  }


  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }


}


@Component({
  selector: 'analytics-acf-chart-timeseries-regular',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-acf-chart [data]="data?.autocorrelation.acf.regular"></analytics-acf-chart>`
})
export class AcfChartVisualizationRegular  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


@Component({
  selector: 'analytics-acf-chart-timeseries-residuals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-acf-chart [data]="data?.autocorrelation.acf.residuals"></analytics-acf-chart>`
})
export class AcfChartVisualizationResiduals  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


@Component({
  selector: 'analytics-pacf-chart-timeseries-regular',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-acf-chart [data]="data?.autocorrelation.pacf.regular"></analytics-acf-chart>`
})
export class PacfChartVisualizationRegular  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


@Component({
  selector: 'analytics-pacf-chart-timeseries-residuals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-acf-chart [data]="data?.autocorrelation.pacf.residuals"></analytics-acf-chart>`
})
export class PacfChartVisualizationResiduals  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}
