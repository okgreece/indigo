/**
 * Created by larjo on 29/7/2016.
 */
import {Cube} from "../../models/cube";
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
import {ExpressionTree} from "../../models/expressionTree";
import {RouteParams} from "@ngrx/router";
import {AppState, getTree, getCube} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../models/expressionNode";
import {TreeActions} from "../../actions/tree";
import {IterablePipe} from "../../pipes/mapToIterable";
import {NgChosenComponent} from "../ng-chosen";
import {AggregateNode} from "../../models/aggregate/aggregateNode";
import {AggregateRequest} from "../../models/aggregate/aggregateRequest";
import {Sort} from "../../models/sort";
import {Drilldown} from "../../models/drilldown";
import {Cut} from "../../models/cut";
import {RudolfCubesService} from "../../services/rudolf-cubes";
import {TreeExecution} from "../../services/tree-execution";
import {AggregateParam} from "../../models/aggregateParam";
import {SortDirection, SortDirectionEnum} from "../../models/sortDirection";
import {Aggregate} from "../../models/aggregate";
import {Attribute} from "../../models/attribute";
import {NestedPropertyPipe} from "../../pipes/nestedProperty";
import {JsonTreeComponent} from "../../lib/json-tree/json-tree";
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs/tabs';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdInput} from '@angular2-material/input/input';
import {Add} from "../../models/func/add";
import {MdButton, MdAnchor} from '@angular2-material/button/button';
import {MdIcon} from '@angular2-material/icon/icon';
import {FuncNode, FuncType} from "../../models/func/funcNode";
declare let $:JQueryStatic;
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Tree Builder` component loaded asynchronously');

@Component({
  moduleId: 'visualization',
  pipes: [IterablePipe,NestedPropertyPipe],
  selector: 'visualization',
  directives: [TAB_DIRECTIVES, CORE_DIRECTIVES, NgChosenComponent, JsonTreeComponent, MD_TABS_DIRECTIVES, MdToolbar, MdInput, NgIf, FORM_DIRECTIVES, NgFor,MdButton, MdAnchor, MdIcon],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  template: require('./visualization.html'),
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
export class TreeVisualization implements AfterViewInit {
  ngAfterViewInit(): any {

    let that = this;
    that.width = $(that.vizCanvas.nativeElement).width() - that.margin.left - that.margin.right;
    that.height = 400 - that.margin.top - that.margin.bottom;
    that.baseSvg = d3.select(that.vizCanvas.nativeElement).append("svg")
      .attr("width", that.width + that.margin.left + that.margin.right)
      .attr("height", that.height + that.margin.top + that.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

    this.expressionTree.subscribe(function (expressionTree) {



      that.expressionTreeInstance = expressionTree;


      that.init();

    });



  }

  baseSvg;

  @ViewChild('vizCanvas') vizCanvas;

  constructor(@Inject(ElementRef) elementRef:ElementRef,
              private store:Store<AppState>,
              private routeParams$:RouteParams,
              private treeActions:TreeActions,
              private rudolfCubesService:RudolfCubesService,
              private treeExecution:TreeExecution, private zone: NgZone, private ref: ChangeDetectorRef) {


    this.vizCanvas = elementRef;
    this.expressionTree = store.let(getTree());

    setInterval(() => {

      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 1000);
  }


  width;
  height;
  x;
  y;
  xAxis;
  yAxis;

  margin = {top: 20, right: 20, bottom: 70, left: 40};




  init(){
    let that = this;
    let data = that.expressionTreeInstance.root.value;
    if(!data) return;
    let colors = d3.scale.category20();


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
    that.baseSvg.html("");
    that.baseSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + that.height + ")")
      .call(that.xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    that.baseSvg.append("g")
      .attr("class", "y axis")
      .call(that.yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".31em")
      .style("text-anchor", "end")
      .text(data.aggregates[0]);

    that.baseSvg.selectAll(".bar")
      .data(data.cells)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill",function(d,i){return colors(i)})
      .attr("x", function(d) { return that.x(d[data.attributes[0]]); })
      .attr("width", that.x.rangeBand())
      .attr("y", function(d) { return that.y(d[data.aggregates[0]]); })
      .attr("height", function(d) { return that.height - that.y(d[data.aggregates[0]]); });

  }

  @Input() expressionTree: Observable<ExpressionTree>;
  expressionTreeInstance: ExpressionTree;

}
