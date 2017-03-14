/**
 * Created by larjo on 3/12/2016.
 */
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
import {Observable} from "rxjs";
import * as $ from 'jquery'
import * as _ from 'lodash';

import {Store} from "@ngrx/store";
@Component({

  templateUrl: './visualizations/acfChart.html'}
  )
export class AnalysisVisualization {

  protected data;

  constructor( protected elementRef: ElementRef,  protected ref: ChangeDetectorRef, protected injector: Injector) {

    this.data = this.injector.get('data', {});

    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);
  }

}
