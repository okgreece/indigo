import {
  Component, Input, Output, EventEmitter, ChangeDetectorRef,
  ChangeDetectionStrategy, AfterViewInit, NgModule
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
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FactRequest} from '../../../models/fact/factRequest';
import {MdDialog, MdDialogRef} from '@angular/material';
import {ApiCubesService} from '../../../services/api-cubes';
import {IterablePipe} from '../../../pipes/mapToIterable';
import {IterablePairsPipe} from '../../../pipes/mapToPairsIterable';
import {PipesModule} from '../../../pipes/index';
import {ExecutionConfiguration} from '../../../models/analysis/executionConfiguration';

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
  templateUrl: './cube-analytics-detail.html',
  styles: [`

    .indigo-icon {
      padding: 0 14px;
    }


    .example-spacer {
      flex: 1 1 auto;
    }
    :host {
      display: flex;
      justify-content: center;

    }

    md-card-title {
      justify-content: center;
      align-items: center;
      display: flex;
      margin-bottom: 0;
    }

    .mat-button-toggle-checked {
      background-color: transparent;
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

    md-toolbar-row [md-mini-fab] {
      margin: 2px;

    }

    .well {
      background-color: #615f5f;
    }
    
    
    md-card.input-card md-card-header{
      background: #82BF5E;
    }



    md-card.input-card {
      background: dimgray;
      margin: 5px 0;
    }

    md-card.input-card:first-child{
      margin: 0 0 5px 0;
    }
    
    .content-card{
      margin: 0 0 5px 10px;
      background: url("src/public/sprites/footer_lodyas.png");
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
      transition: box-shadow 280ms cubic-bezier(.4,0,.2,1);
      will-change: box-shadow;
      display: block;
      position: relative;
      padding: 24px;
      border-radius: 2px;
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
  get configurationName(): Observable<string> {
    return this._configurationName;
  }

  @Input()
  set configurationName(value: Observable<string>) {
    this._configurationName = value;

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
  get executionConfiguration(): ExecutionConfiguration {
    return this._executionConfiguration;
  }

  set executionConfiguration(value: ExecutionConfiguration) {
    this._executionConfiguration = value;
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
  private _configurationName: Observable<string>;
  @Output() add = new EventEmitter<AddOutput>();
  @Output() remove = new EventEmitter<RemoveOutput>();
  loading$: Observable<boolean>;
  public InputTypes = InputTypes;


  public constructor(private store: Store<fromRoot.State>, private algorithmsService: AlgorithmsService, private ref: ChangeDetectorRef, private analysisService: AnalysisService, private route: ActivatedRoute, private router: Router, public dialog: MdDialog, public apiCubesService: ApiCubesService) {

    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.cube$ = this.store.let(fromRoot.getSelectedCube);
        this.loading$ = this.store.let(fromRoot.getExecutionLoading);

        debugger;
        let that = this;
        this.cube$.subscribe(function (cube) {
          that.cube = cube;
          let observableAlgorithm: Observable<Algorithm> = that.algorithmName.flatMap(name => that.algorithmsService.getAlgorithm(name, that.cube));
          observableAlgorithm.subscribe(function (algorithm: Algorithm) {
            debugger;

            let observableConfiguration: Observable<ExecutionConfiguration> = that.configurationName.map(name => algorithm.configurations.get(name));
            that.algorithm = algorithm;

            observableConfiguration.subscribe(function (config: ExecutionConfiguration) {

              that.executionConfiguration = config;
              let call = new AnalysisCall(config, that.cube);
              call.deParametrizeInputs(that.route.snapshot.queryParams);
              that.analysisCall = call;
              debugger;
              if (call.valid) that.execute(that.executionConfiguration);
            });
           });
        });
      }


    });
  }


  private _analysisCall: AnalysisCall;

  private _algorithm: Algorithm;
  private _executionConfiguration: ExecutionConfiguration;

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

  openFactsDialog(input) {

    let that = this;
    this.apiCubesService.fact(this.analysisCall.inputs[input.name]).subscribe(function (json) {
      let dialogRef = that.dialog.open(FactsPreviewDialog);
      dialogRef.componentInstance['json'] = json;
      dialogRef.componentInstance['request'] = that.analysisCall.inputs[input.name];
      dialogRef.componentInstance['cube'] = that.cube;


/*      dialogRef.afterClosed().subscribe(result => {
        that.selectedOption = result;
      });*/
    });


  }

  openAggregateDialog(input) {

    let that = this;
    this.apiCubesService.aggregate(this.analysisCall.inputs[input.name]).subscribe(function (json) {
      let dialogRef = that.dialog.open(AggregatePreviewDialog);
      dialogRef.componentInstance['json'] = json;
      dialogRef.componentInstance['request'] = that.analysisCall.inputs[input.name];
      dialogRef.componentInstance['cube'] = that.cube;


/*      dialogRef.afterClosed().subscribe(result => {
        that.selectedOption = result;
      });*/
    });


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

  public execute(configuration: ExecutionConfiguration) {

    if (configuration.algorithm.name === 'time_series')
      this.prepareTimeSeries();

    if (configuration.algorithm.name === 'descriptive_statistics')
      this.prepareDescriptiveStatistics();


    let that = this;
    this.store.dispatch(new execution.ExecuteAction(null));

    this.analysisService.execute(configuration, this.analysisCall.queryParams())
      .subscribe(function (values) {
        that.analysisCall.outputs['values'] = values;
        that.ref.detectChanges();
        that.store.dispatch(new execution.ExecuteCompleteAction(null));
      });
  }

  newFactRequest = new FactRequest;

  aggregateShown: boolean = false;
  factsShown: boolean = false;


  toggleAggregate() {
    this.aggregateShown = !this.aggregateShown;
  }

  toggleFacts() {
    this.factsShown = !this.factsShown;
  }

}


@Component({
  selector: 'facts-preview-dialog',
  template: `
    <div style="color: white"><h1>Facts preview ({{json.data.length}} records)</h1></div>
    <div style="max-height: 400px; overflow: scroll; background: white">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th *ngFor="let col of json.fields">
            <span *ngIf="cube.model.attributes.get(col)">{{cube.model.attributes.get(col)?.dimension.label}} - {{cube.model.attributes.get(col)?.label}}</span>
            <span *ngIf="cube.model.measures.get(col)">{{cube.model.measures.get(col)?.label}}</span>
            
          
          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let item of json.data">
          <td *ngFor="let col of json.fields">{{item[col]}}</td>
        </tr>
        </tbody>

      </table>
    </div>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush
  /*
   templateUrl: './facts-preview-dialog.html',
   */
})

@NgModule({
  imports: [

    PipesModule,

  ],

})
export class FactsPreviewDialog {
  constructor(public dialogRef: MdDialogRef<FactsPreviewDialog>) {
  }
}


@Component({
  selector: 'aggregate-preview-dialog',
  template: `
    <div style="color: white"><h1>Aggregate preview ({{json.cells.length}} results)</h1></div>
    <div style="max-height: 400px; overflow: scroll; background: white">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th *ngFor="let col of json.attributes">
            <span *ngIf="cube.model.attributes.get(col)">{{cube.model.attributes.get(col)?.dimension.label}} - {{cube.model.attributes.get(col)?.label}}</span>

          </th>
          <th *ngFor="let col of json.aggregates">
            <span *ngIf="cube.model.aggregates.get(col)">{{cube.model.aggregates.get(col)?.label}}</span>

          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let item of json.cells">
          <td *ngFor="let col of json.attributes">{{item[col]}}</td>
          <td *ngFor="let col of json.aggregates">{{item[col]}}</td>
        </tr>
        </tbody>

      </table>
    </div>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

@NgModule({
  imports: [

    PipesModule,

  ],

})
export class AggregatePreviewDialog {
  constructor(public dialogRef: MdDialogRef<AggregatePreviewDialog>) {
  }
}
