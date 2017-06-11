/**
 * Created by larjo on 18/10/2016.
 */
import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input,   ElementRef,
  AfterViewInit, ViewChild
} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';

import {AnalysisCall} from '../../../models/analysis/analysisCall';
import {Cube} from '../../../models/cube';

@Component({
  selector: 'analytics-timeseries-output',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timeseries.html',
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

    svg {
      background: url('assets/sprites/grid_paper.png');
      font-family: monospace;
    }

    svg text {
      font-family: monospace;
    }

    analytics-timeseries-output md-card {
      background: #303030;
    }

    md-progress-spinner svg {
      background: none;
    }

    .content-card md-card {
      margin: 5px;
    }


  `]
})
export class TimeSeriesOutputComponent implements AfterViewInit {

  @Input()
  get analysisCall(): AnalysisCall {
    return this._analysisCall;
  }

  set analysisCall(value: AnalysisCall) {
    this._analysisCall = value;
  }

  private _analysisCall: AnalysisCall;

  get data(): any {
    return this._data;
  }
  @Input()
  set data(value: any) {
    this._data = value;

    if (this.data)
      this.init();


    this.ref.detectChanges();
  }
  ngAfterViewInit(): void {
    if (this.data)
      this.init();
  }


  @Input()
  public cube: Cube;



  @ViewChild('container') container: any;


 private _data: any;




  init() {
    this.container = this.elementRef;
  }



  constructor( private elementRef: ElementRef,       private ref: ChangeDetectorRef) {
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }


}
