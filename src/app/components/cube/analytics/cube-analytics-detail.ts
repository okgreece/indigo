import {
  Component, Input, Output, EventEmitter, ChangeDetectorRef,
  ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import * as fromRoot from '../../../reducers';
import {Cube} from '../../../models/cube';
import {Store} from '@ngrx/store';

import {AlgorithmsService} from '../../../services/algorithms';
import {Algorithm} from '../../../models/analysis/algorithm';
import {Observable} from 'rxjs/Observable';
import {InputTypes} from '../../../models/analysis/input';
import {AnalysisCall} from '../../../models/analysis/analysisCall';
import {AnalysisService} from '../../../services/analysis';
import {Attribute} from '../../../models/attribute';
import * as execution from '../../../actions/execution';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {FactRequest} from '../../../models/fact/factRequest';

/**
 * Tip: Export type aliases for your component's inputs and outputs. Until we
 * get better tooling for templates, this helps enforce you are using a
 * component's API with type safety.
 */
export type InCollectionInput = boolean;
export type AddOutput = Cube;
export type RemoveOutput = Cube;


@Component({
  selector: 'cube-analytics-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./cube-analytics-detail.html'),
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
  
    md-card-title {
      margin-left: 10px;
    }
    img {
      max-width: 100%;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
      margin-bottom: 125px;
    }
    md-card-footer {
      padding-bottom: 75px;
    }
    
     md-toolbar-row [md-mini-fab]{
      margin:2px;
    
    }

    
  `]
})
export class CubeAnalyticsDetailComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.cube$ = this.store.let(fromRoot.getSelectedCube);
    this.loading$ = this.store.let(fromRoot.getExecutionLoading);




  }
  get algorithmName(): Observable<string> {
    return this._algorithmName;
  }
  @Input()
  set algorithmName(value: Observable<string>) {
    this._algorithmName = value;

  }
  get analysisCall() {
    return this._analysisCall;
  }

  set analysisCall(value) {
    this._analysisCall = value;
  }

  get algorithm(): Algorithm {
    return this._algorithm;
  }

  set algorithm(value: Algorithm) {
    this._algorithm = value;
  }

  /**
   * Dumb components receive data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'dumb' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   *
   * Tip: Utilize getters to keep templates clean in 'dumb' components.
   */
  cube: Cube;
  cube$: Observable<Cube>;

  @Input() inCollection: InCollectionInput;
  private _algorithmName: Observable<string>;
  @Output() add = new EventEmitter<AddOutput>();
  @Output() remove = new EventEmitter<RemoveOutput>();
  loading$: Observable<boolean>;
  public InputTypes = InputTypes;


  public constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService,  private ref: ChangeDetectorRef, private analysisService: AnalysisService, private route: ActivatedRoute, private router: Router) {

    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);

    router.events.subscribe((val) => {
      this.cube$ = this.store.let(fromRoot.getSelectedCube);
      this.loading$ = this.store.let(fromRoot.getExecutionLoading);


      let that = this;
      this.cube$.subscribe(function (cube) {
        that.cube = cube;

        let observable: Observable<Algorithm> = that.algorithmName.flatMap(name => that.algorithmsService.getAlgorithm(name));
        that.algorithmsService.getAlgorithm(that.algorithmName);
        observable.subscribe(function (algorithm: Algorithm) {
          that.algorithm = algorithm;
          let call = new AnalysisCall(algorithm, that.cube);
          call.deParametrizeInputs(that.route.snapshot.queryParams);
          that.analysisCall = call;
          debugger;
          if (call.valid) that.execute(that.algorithm);

        });
      });
    });
  }


  private _analysisCall: AnalysisCall;

  private _algorithm: Algorithm;

  get id() {

    return this.cube ? this.cube.id : '';
  }

  get name() {
    return this.cube ? this.cube.pckg.title : '';
  }

  isDateTime(column: Attribute): boolean {
    return this.cube.pckg.model.dimensions[column.dimension.orig_dimension].dimensionType === 'datetime';
  }



  public canExecute() {


  }

  private prepareTimeSeries() {
    let dateTimeDimension = this.analysisCall.inputs['json_data'].drilldowns.find(drilldown => this.isDateTime(drilldown.column));

    this.analysisCall.inputs['json_data'].cube = this.cube;

    if (dateTimeDimension !== undefined) {
      this.analysisCall.inputs['time'] = dateTimeDimension.column;

    }

    if (this.analysisCall.inputs['json_data'].aggregates.length > 0) {
      this.analysisCall.inputs['amount'] = this.analysisCall.inputs['json_data'].aggregates[0].column;

    }

  }

  public setSelected(eventTarget, input_name, collection) {
    this.analysisCall.inputs[input_name] = [];
    for (let i = 0; i < eventTarget.options.length; i++) {

      let optionElement = eventTarget.options[i];

      if (optionElement.selected === true) {
        let key = eventTarget.options[i].attributes['data-key'].value;
        this.analysisCall.inputs[input_name].push(collection.get(key));

      }
    }
  }

  private prepareDescriptiveStatistics() {

    this.newFactRequest.cube = this.cube;


    this.analysisCall.inputs['json_data'] = this.newFactRequest;

  }

  public execute(algorithm: Algorithm) {

    if (algorithm.name === 'time_series')
      this.prepareTimeSeries();

    if (algorithm.name === 'descriptive_statistics')
      this.prepareDescriptiveStatistics();



    let that = this;
    this.store.dispatch(new execution.ExecuteAction(null));

    this.analysisService.execute(algorithm, this.analysisCall)
      .subscribe(function (values) {
        that.analysisCall.outputs['values'] = values;
        that.ref.detectChanges();
        that.store.dispatch(new execution.ExecuteCompleteAction(null));
    });
  }

  newFactRequest = new FactRequest;


}
