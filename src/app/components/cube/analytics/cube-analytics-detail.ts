import {
  Component, Input, Output, EventEmitter, NgModule, ChangeDetectorRef,
  ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import * as fromRoot from '../../../reducers';
import {Cube} from '../../../models/cube';
import {TreeBuilder} from '../../tree/tree-builder';
import {Store} from '@ngrx/store';
import {NgChosenComponent} from '../../ng-chosen';
import {JsonTreeComponent} from '../../../lib/json-tree/json-tree';
import {MdButton, MdToolbar, MdInput, MdAnchor, MdIcon} from '@angular/material';
import {AlgorithmsService} from '../../../services/algorithms';
import {Algorithm} from '../../../models/analysis/algorithm';
import {Observable} from 'rxjs/Observable';
import {InputTypes} from '../../../models/analysis/input';
import {AnalysisCall} from '../../../models/analysis/analysisCall';
import {AnalysisService} from '../../../services/analysis';
import {OutputTypes} from '../../../models/analysis/output';
import {AggregateRequest} from '../../../models/aggregate/aggregateRequest';
import {Attribute} from '../../../models/attribute';
import * as execution from '../../../actions/execution';
import {ActivatedRoute} from "@angular/router";
import {FactRequest} from "../../../models/fact/factRequest";

/**
 * Tip: Export type aliases for your component's inputs and outputs. Until we
 * get better tooling for templates, this helps enforce you are using a
 * component's API with type safety.
 */
export type InCollectionInput = boolean;
export type AddOutput = Cube;
export type RemoveOutput = Cube;

@NgModule({
  declarations: [MdButton, TreeBuilder, NgChosenComponent, NgChosenComponent, JsonTreeComponent, MdToolbar, MdInput, NgIf, NgFor, MdButton, MdAnchor, MdIcon],

})

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
    
    
    md-toolbar.md-primary button{
      color:black;
    }
    
  `]
})
export class CubeAnalyticsDetailComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.cube$ = this.store.let(fromRoot.getSelectedCube);
    this.loading$ = this.store.let(fromRoot.getExecutionLoading);


    let that = this;
    this.cube$.subscribe(function (cube) {
      that.cube = cube;

      let observable: Observable<Algorithm> = that.algorithmName.flatMap(name => that.algorithmsService.getAlgorithm(name));
      that.algorithmsService.getAlgorithm(that.algorithmName);
      observable.subscribe(function (algorithm: Algorithm) {
        that.algorithm = algorithm;
        that.analysisCalls[algorithm.name] = new AnalysisCall(algorithm, that.cube);
      });


    });


  }
  get algorithmName(): Observable<string> {
    return this._algorithmName;
  }
  @Input()
  set algorithmName(value: Observable<string>) {
    this._algorithmName = value;

  }
  get analysisCalls() {
    return this._analysisCalls;
  }

  set analysisCalls(value) {
    this._analysisCalls = value;
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
  public OutputTypes = OutputTypes;


  public constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService,  private ref: ChangeDetectorRef, private analysisService: AnalysisService,route: ActivatedRoute) {
        setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);


  }


  private _analysisCalls = {};

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


  public buildAggregateRequest(): void {


  }

  public canExecute() {


  }

  private prepareTimeSeries(algorithm: Algorithm) {
    let dateTimeDimension = this.newAggregateRequest.drilldowns.find(drilldown => this.isDateTime(drilldown.column));

    this.newAggregateRequest.cube = this.cube;

    if (dateTimeDimension !== undefined) {
      this.analysisCalls[algorithm.name].inputs['time'] = dateTimeDimension.column.ref;

    }

    if (this.newAggregateRequest.aggregates.length > 0) {
      this.analysisCalls[algorithm.name].inputs['amount'] = this.newAggregateRequest.aggregates[0].column.ref;

    }
    this.analysisCalls[algorithm.name].inputs['json_data'] = this.newAggregateRequest;

  }

  public setSelected(eventTarget, algorithm_name, input_name, collection) {
    this.analysisCalls[algorithm_name].inputs[input_name] = [];
    for (let i = 0; i < eventTarget.options.length; i++) {

      let optionElement = eventTarget.options[i];

      if (optionElement.selected === true) {
        let key = eventTarget.options[i].attributes['data-key'].value;
        this.analysisCalls[algorithm_name].inputs[input_name].push(collection.get(key));

      }
    }
    debugger;
  }

  private prepareDescriptiveStatistics(algorithm: Algorithm) {

    this.newFactRequest.cube = this.cube;


    this.analysisCalls[algorithm.name].inputs['json_data'] = this.newFactRequest;

  }

  public execute(algorithm: Algorithm) {

    if (algorithm.name === 'time_series')
      this.prepareTimeSeries(algorithm);

    if (algorithm.name === 'descriptive_statistics')
      this.prepareDescriptiveStatistics(algorithm);



    let that = this;
    this.store.dispatch(new execution.ExecuteAction(null));

    this.analysisService.execute(algorithm, this.analysisCalls[algorithm.name])
      .subscribe(function (values) {
        that.analysisCalls[algorithm.name].outputs['values'] = values;
        that.ref.detectChanges();
        that.store.dispatch(new execution.ExecuteCompleteAction(null));
    });
  }

  newAggregateRequest = new AggregateRequest;
  newFactRequest = new FactRequest;


}
