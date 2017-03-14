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
import {AnalysisVisualization} from "../visualization";


@Component({
  selector: 'analytics-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lineChart.html',
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
export class LineChartVisualization extends AfterViewInit {
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
    let margin = {top: 20, right: 40, bottom: 50, left: 75};


    let viewerWidth = $(this.vizCanvas.nativeElement).width() - margin.left - margin.right;
    let viewerHeight = $(this.vizCanvas.nativeElement).height() - margin.top - margin.bottom;


    let amounts: number[] = _.flatten<number>(data.map(function (d: any) {
      let values = [(d.amount)];
      if (_.has(d, "up80")) values.push((d.up80));
      if (_.has(d, "up95")) values.push((d.up95));
      if (_.has(d, "low80")) values.push((d.low80));
      if (_.has(d, "low95")) values.push((d.low95));
      return values;

    }));

    let max = 1.1 * d3.max(amounts);
    let min = (1 - (0.1 * Math.sign(d3.min(amounts)))) * d3.min(amounts);
    let formatNumber = d3.format(".2n"),
      formatBillion = function(x) { return formatNumber(x / 1e9) + "B"; },
      formatMillion = function(x) { return formatNumber(x / 1e6) + "M"; },
      formatThousand = function(x) { return formatNumber(x / 1e3) + "k"; },
      formatAsIs = function(x) { return x; };

    function formatAbbreviation(x) {
      let v = Math.abs(x);
      return (v >= .9995e9 ? formatBillion
        : v >= .9995e6 ? formatMillion
        : v >= .9995e3 ? formatThousand
        : formatAsIs)(x);
    }


    let x = d3.scaleLinear()
      .range([0, viewerWidth]);

    let y = d3.scaleLinear()
      .range([viewerHeight, 0]);

    let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
      /*.tickFormat(function(d){
       return d3.time.format('%Y')(new Date(d));
       })*/;

    let yAxis = d3.axisLeft(y).tickFormat(formatAbbreviation);


    let line = d3.line()
      .x(function (d: any) {
        return x(d.year);
      })
      .y(function (d: any) {
        return y(d.amount);
      });

    let lineUp80 = d3.line()
      .x(function (d: any) {
        return x(d.year);
      })
      .y(function (d: any) {
        return y(d.up80);
      });
    let lineUp95 = d3.line()
      .x(function (d: any) {
        return x(d.year);
      })
      .y(function (d: any) {
        return y(d.up95);
      });
    let lineLow80 = d3.line()
      .x(function (d: any) {
        return x(d.year);
      })
      .y(function (d: any) {
        return y(d.low80);
      });
    let lineLow95 = d3.line()
      .x(function (d: any) {
        return x(d.year);
      })
      .y(function (d: any) {
        return y(d.low95);
      });



    let svg = d3.select(this.vizCanvas.nativeElement).append("svg")
      .attr("width", viewerWidth + margin.left + margin.right)
      .attr("height", viewerHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(d3.extent(data, function (d: any) {
      return d.year;
    }));
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
      .attr("dx", "-0.91em")
      .style("text-anchor", "end")
      .text("Amount");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line).attr("data-legend","Historical & Predicted");


    svg.append("path")
      .datum(_.filter(data, function (d) {
        return _.has(d, "up80")
      }))
      .attr("class", "lineUp80")
      .attr("d", lineUp80).attr("data-legend","Upper limit for 80% prediction interval");

    svg.append("path")
      .datum(_.filter(data, function (d) {
        return _.has(d, "up95")
      }))
      .attr("class", "lineUp95")
      .attr("d", lineUp95).attr("data-legend","Upper limit for 95% prediction interval");


    svg.append("path")
      .datum(_.filter(data, function (d) {
        return _.has(d, "low80")
      }))
      .attr("class", "lineLow80")
      .attr("d", lineLow80).attr("data-legend","Lower limit for 80% prediction interval");


    svg.append("path")
      .datum(_.filter(data, function (d) {
        return _.has(d, "low95")
      }))
      .attr("class", "lineLow95")
      .attr("d", lineLow95).attr("data-legend","Lower limit for 95% prediction interval");


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
  legend:boolean = false


  init(values: any) {


    let that = this;

    d3.select(that.vizCanvas.nativeElement).html("");

   // this.vizCanvas = this.elementRef;

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
  selector: 'analytics-line-chart-timeseries-trends',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-line-chart [values]="data?.decomposition.trends"></analytics-line-chart>`,
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
export class LineChartTrends  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}
@Component({
  selector: 'analytics-line-chart-timeseries-remainders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-line-chart [values]="data?.decomposition.remainders"></analytics-line-chart>`,
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
export class LineChartRemainders  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


@Component({
  selector: 'analytics-line-chart-timeseries-fitting-residuals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-line-chart  [label_x]="'Time (years)'" [label_y]="'Residual Values'"
                            [values]="data?.fitting.time_residuals"></analytics-line-chart>`,
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
export class LineChartFittingResiduals  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}


@Component({
  selector: 'analytics-line-chart-timeseries-fitting-time-fitted',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<analytics-line-chart [label_x]="'Time (years)'" [label_y]="'Fitted Values'"
                            [values]="data?.fitting.time_fitted"></analytics-line-chart>`,
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
export class LineChartFittingTimeFitted  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}




@Component({
  selector: 'analytics-line-chart-timeseries-forecast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `   <analytics-line-chart [label_x]="'Time (years)'" [label_y]="'Amount'"
                                [values]="data?.forecast.values"></analytics-line-chart>`,
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
export class LineChartTimeSeriesForecast  extends AnalysisVisualization {
  @Input()
  public data: any;

  constructor(elementRef: ElementRef, ref: ChangeDetectorRef, injector: Injector) {
    super(elementRef, ref, injector);

  }

}
