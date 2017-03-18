/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, ElementRef,
  AfterViewInit, ViewChild, Injector
} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {AnalysisVisualization} from '../visualization';


@Component({
  selector: 'analytics-scatter-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scatterPlot.html',
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

circle{
fill: blue;
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


  @Input()
  public label_x: string;


  @Input()
  public label_y: string;

  private _x_accessor: string;
  private _y_accessor: string;


  @Input()
  set values(value: any) {
    this._values = value;


    if (this.values)
      this.init(this.values);

    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {

    if (this.values)
      this.init(this.values);


  }


  @ViewChild('vizCanvas') vizCanvas: any;

  private _values: any;

  private generateBarChart(data: any) {

    let that = this;
    let margin = {top: 20, right: 40, bottom: 60, left: 80};


    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;
    let formatNumber = d3.format('.2n'),
      formatBillion = function (x) {
        return formatNumber(x / 1e9) + 'B';
      },
      formatMillion = function (x) {
        return formatNumber(x / 1e6) + 'M';
      },
      formatThousand = function (x) {
        return formatNumber(x / 1e3) + 'k';
      },
      formatAsIs = function (x) {
        return x;
      };

    function formatAbbreviation(x) {
      let v = Math.abs(x);
      return (v >= .9995e9 ? formatBillion
        : v >= .9995e6 ? formatMillion
          : v >= .9995e3 ? formatThousand
            : formatAsIs)(x);
    }


    let x = d3.scaleLinear().range([0, viewerWidth]);
    let y = d3.scaleLinear().range([viewerHeight, 0]);


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    let svg = d3.select(this.vizCanvas.nativeElement).append('svg')
      .attr('width', viewerWidth + margin.left + margin.right)
      .attr('height', viewerHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');


    // Scale the range of the data
    x.domain(d3.extent(data, function (d:any) {
      return d[that._x_accessor];
    }));
    y.domain([d3.min(data, function (d) {
      return d[that._y_accessor];
    }), d3.max(data, function (d) {
      return d[that._y_accessor];
    })]);


    // Add the scatterplot
    svg.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', 3)
      .attr('cx', function (d) {
        return x(d[that._x_accessor]);
      })
      .attr('cy', function (d) {
        return y(
          d[that._y_accessor]);

      });

    // Add the X Axis
    svg.append('g')
      .attr('transform', 'translate(0,' + viewerHeight + ')')
      .call(d3.axisBottom(x).tickFormat(formatAbbreviation))
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(formatAbbreviation));


    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', viewerHeight)
      .attr('width', viewerWidth)
      .style('stroke', 'black')
      .style('fill', 'none')
      .style('stroke-width', '1');

    svg.append('svg:line')
      .attr('x1', 0)
      .attr('x2', viewerWidth)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .style('stroke', 'black');


    svg.append('text')
      .attr('transform',
        'translate(' + (viewerWidth / 2) + ' ,' +
        (viewerHeight + margin.top + margin.bottom / 2 ) + ')')
      .style('text-anchor', 'middle')
      .text(this.label_x);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (viewerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.label_y);


  }


  init(values: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html('');

    //  this.vizCanvas = this.elementRef;

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


@Component({
  selector: 'analytics-scatter-plot-timeseries-decomposition-fitted-residuals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-scatter-plot [x_accessor]="'year'" [y_accessor]="'amount'"  style="min-height: 500px;" [label_x]="'Fitted Values'" [label_y]="'Residual Values'"
                                [values]="data?.decomposition.fitted_residuals"></analytics-scatter-plot>`,
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
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}


svg text {
  font-family: monospace;
}



  `]
})
export class ScatterPlotTimeseriesDecompositionFittedResiduals extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}



@Component({
  selector: 'analytics-scatter-plot-timeseries-fitting-fitted-residuals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-scatter-plot  style="min-height: 500px;" [values]="data?.fitting.fitted_residuals" [label_x]="'Fitted Values'" [label_y]="'Residual Values'"
                              [x_accessor]="'year'" [y_accessor]="'amount'"></analytics-scatter-plot>`,
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
  stroke-width: 2px;
  stroke-dasharray: 5, 5;

}


svg text {
  font-family: monospace;
}



  `]
})
export class ScatterPlotTimeseriesFittingFittedResiduals extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}

