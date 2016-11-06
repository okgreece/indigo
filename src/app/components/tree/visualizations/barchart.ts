import {Observable} from "rxjs/Rx";
import * as _ from 'lodash';
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input,  ElementRef, ViewChild
} from '@angular/core';
import {Inject,  ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import Timer = NodeJS.Timer;
import {ExpressionTree} from "../../../models/expressionTree";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../../models/expressionNode";
import {TreeVisualization} from "../visualization";
import {TreesState} from "../../../reducers/tree/trees";
declare let $: JQueryStatic;

/**
 * Created by larjo on 25/8/2016.
 */

@Component({
  moduleId: 'visualizaation',
  selector: 'barchart',
  changeDetection: ChangeDetectionStrategy.OnPush, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  template: require('../visualization.html'),
  styles: [`

  
  .bar:hover {
    stroke: indigo;
  }
  
  .axis {
    font: 10px sans-serif;
  }
  
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
export class BarChartVisualization extends TreeVisualization {
  xAxis;
  yAxis;


  @ViewChild('vizCanvas') vizCanvas;

  private generateBarChart(data: any, tuple) {
    let colors = d3.scaleOrdinal(d3.schemeCategory20);
    let that = this;
    let baseSvg = d3.select(that.vizCanvas.nativeElement).append("svg")
      .attr("width", that.width + that.margin.left + that.margin.right)
      .attr("height", that.height + that.margin.top + that.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
    that.x = d3.scaleBand()
      .rangeRound([0, that.width])
      .padding(.1);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    that.xAxis = d3.axisBottom(that.x);


    that.yAxis = d3.axisLeft(that.y)

      .ticks(20, ".0s");

    that.x.domain(data.attributes);


    that.x.domain(data.cells.map(function (d:any) {
      return d[data.attributes[0]]
    }));
    that.y.domain([0, d3.max(data.cells, function (d) {
      return d[data.aggregates[0]];

    })]);
    baseSvg.html("");
    baseSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + that.height + ")")
      .call(that.xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    baseSvg.append("g")
      .attr("class", "y axis")
      .call(that.yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".31em")
      .style("text-anchor", "end")
      .text(data.aggregates[0]);

    baseSvg.selectAll(".bar")
      .data(data.cells)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function (d, i) {
        return colors(i.toString())
      })
      .attr("x", function (d:ExpressionNode) {
        return that.x(d[data.attributes[0]]);
      })
      .attr("width", that.x.rangeBand())
      .attr("y", function (d:ExpressionNode) {
        return that.y(d[data.aggregates[0]]);
      })
      .attr("height", function (d:ExpressionNode) {
        return that.height - that.y(d[data.aggregates[0]]);
      });


    if (tuple) {
      baseSvg.append("text")
        .attr("x", (that.width / 2))
        .attr("y", 0 - (that.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(JSON.stringify(tuple));
    }


  }

  init(root: ExpressionNode) {


    let that = this;
    let data = root.value;
    if (!data) return;
    d3.select(that.vizCanvas.nativeElement).html("");


    let dimensions = _.difference(_.uniq(_.flatten(_.map(data.cells, function (cell) {
      return _.keys(cell);
    }))), data.aggregates);

    if (dimensions.length > 1) {
      let restDimensions = _.slice(dimensions, 1);
      let tuples = _.uniqWith(_.map(data.cells, function (cell) {
        return _.pick(cell, restDimensions)
      }), _.isEqual);

      _.each(tuples, function (tuple) {
        let subset = _.clone(data);
        subset.cells = _.map(_.filter(data.cells, function (cell) {
          return _.isEqual(_.pick(cell, restDimensions), tuple)
        }), function (cell) {
          return _.pick(cell, _.union(_.slice(dimensions, 0, 1), data.aggregates))
        });
        that.generateBarChart(subset, tuple);

      });

    }
    else {
      this.generateBarChart(data, null);
    }



  }

  @Input() expressionTree: Observable<ExpressionTree>;

  x;
  y;

  public get root() {
    return this._root;
  }

  @Input()
  public set root(value) {
    this._root = value;
    if (value)this.init(value);
  }


  constructor(@Inject(ElementRef) elementRef: ElementRef,
               store: Store<TreesState>,
               ref: ChangeDetectorRef) {

    super(elementRef, store, ref);

  }


}
