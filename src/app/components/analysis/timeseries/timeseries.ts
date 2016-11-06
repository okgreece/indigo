/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input,   ElementRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import {Inject, NgZone, ChangeDetectorRef} from '@angular/core';
import * as d3 from 'd3';
import {Observable} from "rxjs";
import * as $ from 'jquery'
import * as _ from 'lodash';

import {Store} from "@ngrx/store";

@Component({
  selector: 'analytics-timeseries-output',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: require('./timeseries.html'),
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
  stroke: steelblue;
  stroke-width: 1.5px;
}

.lineUp80 {
  fill: none;
  stroke: orange;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}
.lineUp95 {
  fill: none;
  stroke: red;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}


.lineLow95 {
  fill: none;
  stroke: green;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}
.lineLow80 {
  fill: none;
  stroke: yellow;
  stroke-width: 1.5px;
    stroke-dasharray: 5,5; 

}



  `]
})
export class TimeSeriesOutputComponent extends AfterViewInit {
  get data(): any {
    return this._data;
  }
  @Input()
  set data(value: any) {
    this._data = value;


    if(value)
    this.init(value);


    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {

    let that = this;


  }



  @ViewChild('container') container:any;


 private _data: any;




  init(values: any) {


    let that = this;


    this.container = this.elementRef;





  }



  constructor( private elementRef: ElementRef,       private ref: ChangeDetectorRef) {
    super();
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}
