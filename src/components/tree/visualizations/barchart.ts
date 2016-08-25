import {Cube} from "../../../models/cube";
import {Observable} from "rxjs/Rx";
import {NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES} from "@angular/common";
import * as _ from 'lodash';
import {TAB_DIRECTIVES} from 'ng2-bootstrap';

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import Timer = NodeJS.Timer;
import {ExpressionTree} from "../../../models/expressionTree";
import {RouteParams} from "@ngrx/router";
import {AppState, getTree, getCube} from "../../../reducers/index";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../../models/expressionNode";
import {TreeActions} from "../../../actions/tree";
import {IterablePipe} from "../../../pipes/mapToIterable";
import {NgChosenComponent} from "../../ng-chosen";
import {AggregateNode} from "../../../models/aggregate/aggregateNode";
import {AggregateRequest} from "../../../models/aggregate/aggregateRequest";
import {Sort} from "../../../models/sort";
import {Drilldown} from "../../../models/drilldown";
import {Cut} from "../../../models/cut";
import {RudolfCubesService} from "../../../services/rudolf-cubes";
import {TreeExecution} from "../../../services/tree-execution";
import {AggregateParam} from "../../../models/aggregateParam";
import {SortDirection, SortDirectionEnum} from "../../../models/sortDirection";
import {Aggregate} from "../../../models/aggregate";
import {Attribute} from "../../../models/attribute";
import {NestedPropertyPipe} from "../../../pipes/nestedProperty";
import {JsonTreeComponent} from "../../../lib/json-tree/json-tree";
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs/tabs';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdInput} from '@angular2-material/input/input';
import {Add} from "../../../models/func/add";
import {MdButton, MdAnchor} from '@angular2-material/button/button';
import {MdIcon} from '@angular2-material/icon/icon';
import {FuncNode, FuncType} from "../../../models/func/funcNode";
import {TreeVisualization} from "../visualization";
declare let $:JQueryStatic;

/**
 * Created by larjo on 25/8/2016.
 */

@Component({
  moduleId: 'visualizaation',
  pipes: [IterablePipe,NestedPropertyPipe],
  selector: 'barchart',
  directives: [TAB_DIRECTIVES, CORE_DIRECTIVES, NgChosenComponent, JsonTreeComponent, MD_TABS_DIRECTIVES, MdToolbar, MdInput, NgIf, FORM_DIRECTIVES, NgFor,MdButton, MdAnchor, MdIcon],
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
export class BarChartVisualization extends TreeVisualization{
  xAxis;
  yAxis;



  @ViewChild('vizCanvas') vizCanvas;

  private generateBarChart(data: Object, tuple){
    let colors = d3.scale.category20();
    let that = this;
    let baseSvg = d3.select(that.vizCanvas.nativeElement).append("svg")
      .attr("width", that.width + that.margin.left + that.margin.right)
      .attr("height", that.height + that.margin.top + that.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
    that.x = d3.scale.ordinal()
      .rangeRoundBands([0, that.width], .1);

    that.y = d3.scale.linear()
      .range([that.height, 0]);

    that.xAxis = d3.svg.axis()
      .scale(that.x)
      .orient("bottom");

    that.yAxis = d3.svg.axis()
      .scale(that.y)
      .orient("left")
      .ticks(20, ".0s");

    that.x.domain(data.attributes);


    that.x.domain(data.cells.map(function(d){return d[data.attributes[0]]}));
    that.y.domain([0, d3.max(data.cells, function(d) {
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
      .attr("fill",function(d,i){return colors(i)})
      .attr("x", function(d) { return that.x(d[data.attributes[0]]); })
      .attr("width", that.x.rangeBand())
      .attr("y", function(d) { return that.y(d[data.aggregates[0]]); })
      .attr("height", function(d) { return that.height - that.y(d[data.aggregates[0]]); });



    if(tuple){
      baseSvg.append("text")
        .attr("x", (that.width / 2))
        .attr("y", 0 - (that.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(JSON.stringify(tuple));
    }


  }

  init(root: ExpressionNode){


    let that = this;
    let data = root.value;
    if(!data) return;
    d3.select(that.vizCanvas.nativeElement).html("");



    let dimensions = _.difference(_.uniq(_.flatten(_.map(data.cells, function (cell) {
      return _.keys(cell);
    }))), data.aggregates);

    if(dimensions.length>1){
      let restDimensions = _.slice(dimensions, 1);
      let tuples = _.uniqWith(_.map(data.cells, function(cell){return _.pick(cell,restDimensions)}), _.isEqual);

      _.each(tuples, function (tuple) {
        let subset = _.clone(data);
        subset.cells = _.filter(data.cells, function(cell){return _.isEqual(_.pick(cell, restDimensions), tuple)});
        that.generateBarChart(subset, tuple);

      } );

    }
    else{
      this.generateBarChart(data, null);
    }

debugger;


  }
  @Input() expressionTree: Observable<ExpressionTree>;

  x;
  y;
  public get root(){
    return this._root;
  }
  @Input()
  public set root(value){
    this._root = value;
    if(value)this.init(value);
  }




  constructor(@Inject(ElementRef) elementRef:ElementRef,
              private store:Store<AppState>,
             private ref: ChangeDetectorRef) {

    super(elementRef,store,ref);

  }


}
