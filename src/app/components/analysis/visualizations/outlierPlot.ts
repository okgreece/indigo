/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, ElementRef,
  AfterViewInit, ViewChild, Injector
} from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery'
import * as _ from 'lodash';
import {AnalysisVisualization} from '../visualization';


@Component({
  selector: 'analytics-outlier-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './outlierPlot.html',
  styles: [`


    .chart rect {
      fill: steelblue;
    }
    .chart rect:hover {
      fill: turquoise;
    }
    .chart .rectM {
      stroke: green;
      stroke-width: 1;
      fill: green;
      fill-opacity: .2;
    }
    .chart .rectM:hover {
      fill: green;
      fill-opacity: .5;
    }
    .chart text {
      font: 10px sans-serif;
    }
    .chart .title {
      font: 10px sans-serif;
    }
    .axis path, .axis line {
      fill: none;
      stroke: #000;
      shape-rendering: crispEdges;
    }
    div.extra {
      position: absolute;
      text-align: center;
      width: 150px;
      height: 170px;
      padding: 2px;
      font: 10px sans-serif;
      background: lightsteelblue;
      border: 0px;
      border-radius: 4px;
    }
    .x.axis path {
      display: block;
    }
  `]
})
export class OutlierPlotVisualization implements AfterViewInit {
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
  public color;

  @Input()
  public group;

  private generateOutlierPlot(data: any) {
    const margin = {top: 20, right: 40, bottom: 80, left: 75};


    const viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    const viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;




    const svg = d3.select(this.vizCanvas.nativeElement).append('svg')
      .attr('width', viewerWidth + margin.left + margin.right)
      .attr('height', viewerHeight + margin.top + margin.bottom) .append("g")
      .attr('transform','translate(' + margin.left + "," + margin.top + ")");


    const that = this;





    const x = d3.scaleBand()
      .domain(this.values.map(function(entry){
        return entry[that.group.ref];
      }))
      .rangeRound([0, viewerWidth]);

    const y = d3.scaleLinear()
      .domain([

        Number(d3.min(this.values, function (d: any) { return Number(d.Target); })),
        Number(d3.max(this.values, function (d: any) { return Number(d.Target); }))
      ])
      .range([viewerHeight, 0]);

    const scale = d3.scaleSqrt()
      .domain([
        Number(d3.min(this.values, function (d: any) { return d.Score; })),
        Number(d3.max(this.values, function (d: any) { return d.Score; }))
      ])
      .range([1, 40]);

    const opacity = d3.scaleSqrt()
      .domain([
        Number(d3.min(this.values, function (d: any) { return d.Score; })),
        Number(d3.max(this.values, function (d: any) { return d.Score; }))
      ])
      .range([1, .5]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Define the div for the tooltip
    const div = d3.select('body').append('div')
      .attr('class', 'extra')
      .style('opacity', 0);

    // y axis and label
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('x', 100)
      .attr('y', margin.left + 120)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .style('font-weight', 'bold')
      .text('Amount');


    svg.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(0," + viewerHeight + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    ;

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = {};
    this.values.forEach(function(d) {
      colors[d[that.color.ref]] = color(d[that.color.ref]);
    });

    let i = 0;
    for (const key in colors) {
      if (!colors.hasOwnProperty(key)) {
        continue;
      }
      i++;
      svg.append('text')
        .style('fill', colors[key])
        .style('font-weight', 'bold')
        .style('font-size', '10px')
        .attr('x', viewerWidth + 50)
        .attr('y', -50 + 20 * i)
        .text(key);
    }

    svg.selectAll('circle')
      .data(this.values)
      .enter()
      .insert('circle')
      .attr('cx', viewerWidth / 2)
      .attr('cy', viewerHeight / 2)
      .attr('opacity', function (d: any) { return opacity(d.Score); })
      .attr('r', function (d: any) { return scale(d.Score); })
      .style('fill', function (d: any) {return color(d[that.color.ref]); })
      .on('mouseover', function (d: any, j) {
        fade(d[that.color.ref], .1);
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html('<b><p>Group: ' + d[that.group.ref] + '</p><p>Money: ' + d.Target + '</p><p>' + that.color.label + ': ' + d[that.color.ref] +
          '</p><p>Outlier Score: ' + d.Score + '</b>')
          .style('left', (d3.event.pageX + 20) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function (d, j) {
        fadeOut();
        div.transition()
          .duration(200)
          .style('opacity', 0);
      })
      .transition()
      .attr('cx', function (d: any) {  return x(d[that.group.ref]) + x.bandwidth() / 2; })
      .attr('cy', function (d: any) { return y(d.Target); });



    function fade(col, opac) {
      svg.selectAll('circle')
        .filter(function (d: any) {
          return d.color !== col;
        })
        .transition()
        .style('opacity', opac);
    }

    function fadeOut() {
      svg.selectAll('circle')
        .transition()
        .style('opacity', function (d: any) { return opacity(d.Score); });
    }



  }


  init(values: any) {


    const that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

   // this.vizCanvas = this.elementRef;

    this.generateOutlierPlot(values);


  }



  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) {
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}


@Component({
  selector: 'analytics-outliers-heat-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-tree-diagram [values]="data"></analytics-tree-diagram>`,
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
  stroke: #82bf5e;
  stroke-width: 2px;
}

.lineUp80 {
  fill: none;
  stroke: orange;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineUp95 {
  fill: none;
  stroke: red;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineLow95 {
  fill: none;
  stroke: green;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}

.lineLow80 {
  fill: none;
  stroke: gold;
  stroke-width: 1.5px;
  stroke-dasharray: 5, 5;

}


svg text {
  font-family: monospace;
}



  `]
})
export class OutliersHeatmapDiagram  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


