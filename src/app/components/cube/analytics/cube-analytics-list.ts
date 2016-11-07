import {Component, Input, Inject, ElementRef, ChangeDetectorRef} from '@angular/core';
import { Cube } from '../../../models/cube';
import {Algorithm} from "../../../models/analysis/algorithm";
import {Store} from '@ngrx/store';
import {AlgorithmsService} from "../../../services/algorithms";
import {AnalysisService} from "../../../services/analysis";
import {Observable} from "rxjs";
import * as fromRoot from '../../../reducers';

@Component({
  selector: 'indigo-cube-preview-list',
  template: `
    <indigo-cube-analytics-preview *ngFor="let algorithm of algorithms" [cube]="cube" [algorithm]="algorithm"></indigo-cube-analytics-preview>
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `]
})
export class CubeAnalyticsListComponent {
  @Input() algorithms: Algorithm[];

  cube$: Observable<Cube>;
  loading$: Observable<boolean>;
  cube: Cube;

  constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService, @Inject(ElementRef) elementRef: ElementRef, private ref: ChangeDetectorRef){
    this.cube$ = store.let(fromRoot.getSelectedCube);
    this.loading$ = store.let(fromRoot.getExecutionLoading);

    let that = this;
    this.cube$.subscribe(function (cube) {
      that.cube = cube;

      let observable: Observable<Algorithm[]> =
        that.algorithmsService.getCompatibleAlgorithms(cube);

      observable.subscribe(function (algorithms: Algorithm[]) {
        that.algorithms = algorithms;



      })


    });


    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);

  }

}
