/**
 * Created by larjo on 29/7/2016.
 */
import {Observable} from "rxjs/Rx";


import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input,  ElementRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import Timer = NodeJS.Timer;
import {ExpressionTree} from "../../models/expressionTree";
import {State,  getSelectedCube} from "../../reducers/index";
import {Store} from "@ngrx/store";
import {ExpressionNode} from "../../models/expressionNode";
import {IterablePipe} from "../../pipes/mapToIterable";
import {NgChosenComponent} from "../ng-chosen";
import {RudolfCubesService} from "../../services/rudolf-cubes";
import {TreeExecution} from "../../services/tree-execution";
import {NestedPropertyPipe} from "../../pipes/nestedProperty";
import {JsonTreeComponent} from "../../lib/json-tree/json-tree";
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MdToolbar, MdAnchor, MdButton, MdInput, MdIcon} from "@angular/material";
import {getTree} from "../../reducers/tree/trees";
import * as $ from 'jquery'
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Tree Builder` component loaded asynchronously');

@Component({
  moduleId: 'visualization',
  selector: 'visualization',
  changeDetection: ChangeDetectionStrategy.OnPush, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  template: require('./visualization.html'),

})
export class TreeVisualization implements AfterViewInit {
  ngAfterViewInit(): any {

    let that = this;
    that.width = $(that.vizCanvas.nativeElement).width() - that.margin.left - that.margin.right;
    that.height = 400 - that.margin.top - that.margin.bottom;


    this.expressionTree.subscribe(function (expressionTree) {



      that.expressionTreeInstance = expressionTree;


      that.init(expressionTree.root);

    });



  }

  protected baseSvg;

  @ViewChild('vizCanvas') vizCanvas;

  constructor(@Inject(ElementRef) elementRef:ElementRef,
              private store:Store<State>,
               private ref: ChangeDetectorRef) {


    this.vizCanvas = elementRef;
    this.expressionTree = store.let(getTree);

    setInterval(() => {

      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 1000);
  }


  width;
  height;

  margin = {top: 20, right: 20, bottom: 70, left: 40};


  public init(root: ExpressionNode){

  }


  @Input() expressionTree: Observable<ExpressionTree>;
  expressionTreeInstance: ExpressionTree;
  _root: ExpressionNode;

  public get root(){
    return this._root;
  }
  @Input()
  public set root(value){
    this._root = value;
    if(value)this.init(value);
  }
}
