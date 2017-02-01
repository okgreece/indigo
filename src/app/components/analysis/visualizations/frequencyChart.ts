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
  selector: 'analytics-frequency-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./frequencyChart.html'),
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


.bar:hover {
  fill: brown;
}

.axis--x path {
  display: none;
}



  `]
})
export class FrequencyVisualization extends AfterViewInit {
  get data(): any {
    return this._data;
  }
  @Input()
  set data(value: any) {
    this._data = value;
    if (this._data)
      this.init(this._data);

    this.ref.detectChanges();
  }

  initialized:boolean = false;

  ngAfterViewInit(): void {

    this.initialized = true;
    if(this._data)
      this.init(this.data);
  }

  @Input()
  public label_x: string;


  @Input()
  public label_y: string;

  @ViewChild('vizCanvas') vizCanvas:any;
 private _data: any;

  private generateChart(data: any) {
    let margin = {top: 10, right: 10, bottom: 105, left: 45};

    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;
    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      ;

debugger;
    let sum = data.reduce(function (a, b) { return a + b.frequency; }, 0);

    let x = d3.scaleBand().rangeRound([0, viewerWidth]).padding(0.1),
      y = d3.scaleLinear().rangeRound([viewerHeight, 0]);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      x.domain(data.map(function(d:any) { return d.label; }));
      y.domain([0, 1]);


    let color = d3.scaleOrdinal(d3.schemeCategory10);


      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + viewerHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", "1em")
/*
        .attr("transform", "rotate(45)")
*/
        .style("text-anchor", "middle")
        .call(this.wrap, x.bandwidth());


      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d:any) { return x(d.label); })
        .attr("y", function(d:any) { return y(d.frequency/sum); })
        .style("fill", function(d:any) { return color(x(d.label).toString()); } )
        .attr("width", x.bandwidth())
        .attr("height", function(d:any) { return viewerHeight - y(d.frequency/sum); });

    let yTextPadding = 10;
    g.selectAll(".bartext")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bartext")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("x", function(d:any) { return x(d.label) + x.bandwidth()/2; })

      .attr("y", function(d:any) {
        return y(d.frequency/sum) + yTextPadding;
      })
      .text(function(d: any){
        return d.frequency;
      });


  }


  init(data: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

    //this.vizCanvas = this.elementRef;

    this.generateChart(data);




  }



   wrap(text, width) {
  text.each(function() {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      let node: SVGTSpanElement = <SVGTSpanElement>tspan.node();

      if (node.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}



  constructor( private elementRef: ElementRef,       private ref: ChangeDetectorRef) {
    super();
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}



@Component({
  selector: 'analytics-frequency-chart-descriptive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-frequency-chart *ngFor="let item of data?.frequencies|iterable"   style="min-height: 500px;"  [label_y]="Frequency" [label_x]="Dimension" [data]="item"></analytics-frequency-chart>`,
  styles: [`




  `]
})
export class FrequencyChartDescriptive  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}
