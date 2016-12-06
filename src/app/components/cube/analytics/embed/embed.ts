import {Component, Input, Inject, ElementRef, ChangeDetectorRef, Output, NgModule} from '@angular/core';
import { Cube } from '../../../../models/cube';
import {Algorithm} from "../../../../models/analysis/algorithm";
import {Store} from '@ngrx/store';
import {AlgorithmsService} from "../../../../services/algorithms";
import {AnalysisService} from "../../../../services/analysis";
import {Observable} from 'rxjs';
import * as fromRoot from '../../../../reducers';
import EventEmitter = webdriver.EventEmitter;
import {AddOutput, RemoveOutput, InCollectionInput} from "../cube-analytics-detail";
import {DynamicHTMLModule} from "ng-dynamic";
import {AcfChartVisualization} from "../../../analysis/visualizations/acfChart";
import {ActivatedRoute} from "@angular/router";
import {ApiCubesService} from "../../../../services/api-cubes";
import {URLSearchParams} from "@angular/http";
import {DynamicComponents} from "../../../dynamic-component";

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

@NgModule({
  imports: [
    DynamicHTMLModule.forRoot({
      components: [
        { component: AcfChartVisualization, selector: 'analytics-acf-chart' },
      ]
    })
  ],
})
export class CubeEmbedAnalyticsComponent {
  @Input() algorithms: Algorithm[];
  componentData = null;
  cube$: Observable<Cube>;
  loading$: Observable<boolean>;
  cube: Cube;
  @Input() inCollection: InCollectionInput;
  private _algorithmName: Observable<string>;

  get algorithmName(): Observable<string> {
    return this._algorithmName;
  }
  @Input()
  set algorithmName(value: Observable<string>) {
    this._algorithmName = value;

  }
  constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService, @Inject(ElementRef) elementRef: ElementRef, private ref: ChangeDetectorRef, route: ActivatedRoute, apiService: ApiCubesService, analysisService: AnalysisService) {
    this.cube$ = store.let(fromRoot.getSelectedCube);
    this.loading$ = store.let(fromRoot.getExecutionLoading);

    let that = this;
    this.cube$.subscribe(function (cube) {
      that.cube = cube;

      let observable: Observable<Algorithm> =
        that.algorithmsService.getAlgorithm(route.snapshot.params["algorithm"]);

      observable.subscribe(function (algorithm: Algorithm) {

        route.queryParams.subscribe(function (params) {
          let inputs = new URLSearchParams();
          for (let param in params) {
            inputs.append(param, params[param]);
          }


          analysisService.timeseries(algorithm, inputs).subscribe(function (outputs) {
            that.componentData = {
              component: DynamicComponents[route.snapshot.params["part"]],
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
