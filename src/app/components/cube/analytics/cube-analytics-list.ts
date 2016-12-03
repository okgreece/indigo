import {Component, Input, Inject, ElementRef, ChangeDetectorRef} from '@angular/core';
import { Cube } from '../../../models/cube';
import {Algorithm} from "../../../models/analysis/algorithm";
import {Store} from '@ngrx/store';
import {AlgorithmsService} from "../../../services/algorithms";
import {AnalysisService} from "../../../services/analysis";
import {Observable} from "rxjs";
import * as fromRoot from '../../../reducers';

@Component({
  selector: 'indigo-cube-analytics-preview-list',
  template: `
<div class="card-container">
    <indigo-cube-analytics-preview *ngFor="let algorithm of algorithms" [cube]="cube" [algorithm]="algorithm"></indigo-cube-analytics-preview>

</div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
        md-card {
      margin: 0 16px 16px 0;
      width: 350px;
    }
    
    .card-container {
      display: flex;
      flex-direction: column;
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
