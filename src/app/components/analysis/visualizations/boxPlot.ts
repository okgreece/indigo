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
import {Observable} from 'rxjs';
import * as $ from 'jquery';
import * as _ from 'lodash';

import {Store} from '@ngrx/store';
import {AnalysisVisualization} from '../visualization';

@Component({
  selector: 'analytics-box-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './boxPlot.html',
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

.box {
  fill:none;
  stroke: blue;
  stroke-width: 1.5px;
}



.bar:hover {
  fill: brown;
}

.axis--x path {
  display: none;
}

.median{
stroke-width: 3px;
stroke: green;
}



  `]
})
export class BoxPlotVisualization implements AfterViewInit {
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

  private generateBarChart(data: any) {
    let margin = {top: 10, right: 10, bottom: 105, left: 45};

    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;
    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      ;



    let x = d3.scaleBand().rangeRound([0, viewerWidth]).padding(0.1),
      y = d3.scaleLinear().rangeRound([viewerHeight, 0]);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      x.domain(data.map(function(d:any) { return d.label; }));
      y.domain([d3.min(data, function(d: any) { return d['lo.whisker'] as number; }) , d3.max(data, function(d: any) {return d['up.whisker'] as number; }) ]);


      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + viewerHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .call(this.wrap, x.bandwidth());


      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

      g.selectAll(".box")
        .data(data)
        .enter().append("rect")
        .attr("class", "box")
        .attr("x", function(d:any) { return x(d.label) + (x.bandwidth() - viewerHeight - y( d["box.width"][0])) / 2; })
        .attr("y", function(d:any) { return y( d["up.hinge"]); })
        .attr("width", function(d:any) { return viewerHeight + y( d["box.width"][0]); })
        .attr("height", function(d:any) { return Math.abs(y( d["up.hinge"]) -  y(d["lo.hinge"])); });

    g.selectAll(".median")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "median")
      .attr("x1", function(d:any) { return x(d.label) + (x.bandwidth() - viewerHeight - y( d["box.width"][0])) / 2;})
      .attr("x2", function(d:any) { return x(d.label) + (x.bandwidth() - viewerHeight - y( d["box.width"][0])) / 2 + viewerHeight + y( d["box.width"][0]);})
      .attr("y1", function(d:any) { return y( d["median"]); })
      .attr("y2", function(d:any) { return y( d["median"]); });

    g.selectAll(".upconnect")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "upconnect")
      .attr("x1", function(d:any) { return x(d.label) + x.bandwidth() / 2; })
      .attr("x2", function(d:any) { return x(d.label) + x.bandwidth() / 2; })
      .attr("y1", function(d:any) { return y( d['up.hinge']); })
      .attr("y2", function(d:any) { return y( d['up.whisker']); }) .style('stroke', 'black');

    g.selectAll(".loconnect")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "loconnect")
      .attr("x1", function(d:any) { return x(d.label) + x.bandwidth() / 2; })
      .attr("x2", function(d:any) { return x(d.label) + x.bandwidth() / 2; })
      .attr("y1", function(d:any) { return y( d['lo.hinge']); })
      .attr("y2", function(d:any) { return y( d['lo.whisker']); }) .style('stroke', 'black');


    g.selectAll(".upwhisker")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "upwhisker")
      .attr("x1", function(d:any) { return  (x.bandwidth() - viewerHeight - y( d["box.width"][0])) /2   +  .7 * ( viewerHeight + y( d["box.width"][0]) );})
      .attr("x2", function(d:any) { return  (x.bandwidth() - viewerHeight - y( d["box.width"][0])) /2   +  1.3 * ( viewerHeight + y( d["box.width"][0]) );})
      .attr("y1", function(d:any) { return y( d["up.whisker"]); })
      .attr("y2", function(d:any) { return y( d["up.whisker"]); }) .style("stroke", "black");

  g.selectAll(".lowhisker")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "lowhisker")
    .attr("x1", function(d:any) { return  (x.bandwidth() - viewerHeight - y( d["box.width"][0])) /2   +  .7 * ( viewerHeight + y( d["box.width"][0]) );})
    .attr("x2", function(d:any) { return  (x.bandwidth() - viewerHeight - y( d["box.width"][0])) /2   +  1.3 * ( viewerHeight + y( d["box.width"][0]) );})
    .attr("y1", function(d:any) { return y( d["lo.whisker"]); })
      .attr("y2", function(d:any) { return y( d["lo.whisker"]); }) .style("stroke", "black");

    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", viewerHeight)
      .attr("width", viewerWidth)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1");
  }


  init(data: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

    //this.vizCanvas = this.elementRef;

    this.generateBarChart(data);




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
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}


@Component({
  selector: 'analytics-box-plot-descriptive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `    <analytics-box-plot style="min-height: 500px;"  [label_y]="'Frequency'" [label_x]="'Dimension'" [data]="data.boxplot"></analytics-box-plot>`,
  styles: [`




  `]
})
export class BoxPlotDescriptive  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}
