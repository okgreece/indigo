import {Component, Input, Inject, ElementRef, ChangeDetectorRef} from '@angular/core';
import { Cube } from '../../../../models/cube';
import {Algorithm} from '../../../../models/analysis/algorithm';
import {Store} from '@ngrx/store';
import {AlgorithmsService} from '../../../../services/algorithms';
import {AnalysisService} from '../../../../services/analysis';
import {Observable} from 'rxjs';
import * as fromRoot from '../../../../reducers';
import {AcfChartVisualization} from '../../../analysis/visualizations/acfChart';
import {ActivatedRoute} from '@angular/router';
import {ApiCubesService} from '../../../../services/api-cubes';
import {URLSearchParams} from '@angular/http';
import {DynamicComponents} from '../../../dynamic-component';
import {ExecutionConfiguration} from '../../../../models/analysis/executionConfiguration';
export type InCollectionInput = boolean;

@Component({
  selector: 'indigo-cube-analytics-embed',
  template: `
      <dynamic-component style="min-height: 250px; min-width: 250px;" [componentData]="componentData"></dynamic-component>

  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    analytics-acf-chart{
      width: 250px;
      height: 250px;
    }
    

  `]
})

export class CubeAnalyticsEmbedComponent {
  componentData = null;
  cube$: Observable<Cube>;
  loading$: Observable<boolean>;
  cube: Cube;
  @Input() inCollection: InCollectionInput;
  private _algorithmName: Observable<string>;
  private _configurationName: Observable<string>;
  @Input()
  get algorithmName(): Observable<string> {
    return this._algorithmName;
  }
  set algorithmName(value: Observable<string>) {
    this._algorithmName = value;

  }

  @Input()
  get configurationName(): Observable<string> {
    return this._configurationName;
  }
  set configurationName(value: Observable<string>) {
    this._configurationName = value;

  }
  constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService, @Inject(ElementRef) elementRef: ElementRef, private ref: ChangeDetectorRef, route: ActivatedRoute, apiService: ApiCubesService, analysisService: AnalysisService) {
    this.cube$ = store.let(fromRoot.getSelectedCube);
    this.loading$ = store.let(fromRoot.getExecutionLoading);

    let that = this;
    this.cube$.subscribe(function (cube) {
      that.cube = cube;

      let observableAlgorithm: Observable<Algorithm> =
        that.algorithmsService.getAlgorithm(route.snapshot.params['algorithm'], cube);


      observableAlgorithm.subscribe(function (algorithm: Algorithm) {


        let configuration: ExecutionConfiguration = algorithm.configurations.get(route.snapshot.params['configuration']);



        route.queryParams.subscribe(function (params) {
          let inputs = new URLSearchParams();
          for (let param in params) {
            inputs.append(param, params[param]);
          }


          analysisService.execute(configuration, params).subscribe(function (outputs) {
            that.componentData = {
              component: DynamicComponents[route.snapshot.params['part']],
              inputs: {
                data: outputs
              }
            };
          });
        });







      });


    });


    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);

  }

}
