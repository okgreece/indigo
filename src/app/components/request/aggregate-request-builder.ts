/**
 * Created by larjo on 27/9/2016.
 */

import * as _ from 'lodash';
import {ApiCubesService} from '../../services/api-cubes';

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Output,
  EventEmitter, ChangeDetectorRef
} from '@angular/core';
import {Aggregate} from '../../models/aggregate';
import {Sort} from '../../models/sort';
import {Attribute} from '../../models/attribute';
import {SortDirection} from '../../models/sortDirection';
import {Transitivity} from '../../models/transitivity';
import {Drilldown} from '../../models/drilldown';
import {Cut} from '../../models/cut';
import {AggregateParam} from '../../models/aggregateParam';
import {AggregateRequest} from '../../models/aggregate/aggregateRequest';
import {Cube} from '../../models/cube';


@Component({
  moduleId: 'aggregate-request-builder',

  selector: 'aggregate-request-builder',
  changeDetection: ChangeDetectionStrategy.Default, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  templateUrl: './aggreegate-request-builder.html',
  styles: [`
ul.alt-list {
  padding: 0;
  margin: 10px 0
}

ul.alt-list li {
  list-style-type: none;
  margin: .1rem 0;
  padding: .5rem 0;
  display: flex;
  align-items: center;
  background: rgba(66, 66, 66, 0.3);

}

a.action-anchor {
  cursor: pointer;
  margin: auto 10px;

}

.md-tab-label {
  min-width: max-content !important;

}

md-toolbar-row [md-mini-fab] {
  margin: 2px;

}

.md-tab-body-wrapper {

  max-height: 700px;
  overflow-y: auto !important;

}

span.node-key {
  cursor: pointer;
}

  `]
})
export class AggregateRequestBuilder {
  @Output()
  public onRequestBuilt: EventEmitter<AggregateRequest> = new EventEmitter<AggregateRequest>();
  @Output() requestChange = new EventEmitter();
  newAggregateRequest: AggregateRequest;
  newSortAttribute: Attribute;
  newDrilldownAttribute: Attribute;
  newCutAttribute: Attribute;
  newCutValueVal: string;
  newSortDirection: SortDirection;
  newCustomValue: any;
  sortDirections: Map<string, SortDirection> = SortDirection.directions;
  public newAggregatePageNumber = 0;
  public newAggregatePageSize = null;
  members: Map<string, Map<string, Object>> = new Map<string, Map<string, Object>>();
  cutMembers: string[] = [];
  transitivities: Transitivity[] = Transitivity.staticFactory();
  newCutTransitivity: Transitivity = this.transitivities[0];
  _cube: Cube;
  private _newAggregateAggregate: Aggregate;

  constructor(private ref: ChangeDetectorRef, private rudolfCubesService: ApiCubesService) {
    setInterval(() => {
      // the following is required, otherwise the view will not be updated
      this.ref.markForCheck();
    }, 5000);

  }

  public get cube() {
    return this._cube;
  }

  @Input()
  public set cube(value: Cube) {
    const that = this;
    that._cube = value;
  }

  public get request(): AggregateRequest {
    return this.newAggregateRequest;
  }

  @Input()
  public set request(value: AggregateRequest) {
    const that = this;
    that.newAggregateRequest = value;
  }


  get newAggregateAggregate(): Aggregate {
    return this._newAggregateAggregate;
  }

  set newAggregateAggregate(value: Aggregate) {
    this._newAggregateAggregate = value;
  }

  addAggregateChild() {



    this.newAggregateRequest.cube = this.cube;
    this.newAggregateRequest.page = this.newAggregatePageNumber;
    this.newAggregateRequest.pageSize = this.newAggregatePageSize;


    this.onRequestBuilt.emit(this.newAggregateRequest);
    this.newAggregateRequest = new AggregateRequest;
    this.newAggregateRequest.cube = this.cube;
  }

  addAggregate() {
    const newAggregate = new AggregateParam();
    newAggregate.column = this._newAggregateAggregate;
    this.newAggregateRequest.aggregates.push(newAggregate);

    this.requestChange.emit(this.request);
    this.newAggregateRequest.emitAggregateChanges();

  }

  removeAggregate(aggregate: AggregateParam) {
    _.remove(this.newAggregateRequest.aggregates, aggregate);
    this.newAggregateRequest.emitAggregateChanges();

  }

  addCut() {
    const newCut = new Cut();
    newCut.column = this.newCutAttribute;
    newCut.transitivity = this.newCutTransitivity;
    newCut.value = this.newCutValueVal;
    this.newAggregateRequest.cuts.push(newCut);
  }

  removeCut(cut: Cut) {
    _.remove(this.newAggregateRequest.cuts, cut);
  }

  addDrilldown() {
    const newDrilldown = new Drilldown();
    newDrilldown.column = this.newDrilldownAttribute;
    this.newAggregateRequest.drilldowns.push(newDrilldown);
    this.newAggregateRequest.emitAttributesChanges();

  }

  removeDrilldown(drilldown: Drilldown) {
    _.remove(this.newAggregateRequest.drilldowns, drilldown);
    this.newAggregateRequest.emitAttributesChanges();

  }

  addSort() {

    const newSort = new Sort();
    newSort.column = this.newSortAttribute;
    newSort.direction = this.newSortDirection;
    this.newAggregateRequest.sorts.push(newSort);
  }

  removeSort(sort: Sort) {
    _.remove(this.newAggregateRequest.sorts, sort);
  }

  selectedCutChanged($event: Attribute) {
    this.newCutValueVal = '';
    this.newCutAttribute = $event;
    this.getMembers($event.ref);
  }

  selectedCutValChanged(search: string) {
    this.searchMembers(this.newCutAttribute, search);
  }

  setCutValue(member: string) {
    this.newCutValueVal = member;
  }

  searchMembers(attribute: Attribute, search: string) {
    if (!attribute) {
      return;
    }
    const that = this;
    this.rudolfCubesService.members(this.cube, attribute.dimension).subscribe(response => {
      that.members.set(attribute.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function (member) {
        return member[attribute.ref];
      }).filter(function (value) {
        return value && (search === '' || search === undefined || search === null || value.indexOf(search) > -1);
      });

    });
  }

  getMembers(attributeName: string) {

    const newCutDimension = _.filter(Array.from(this.cube.model.attributes.values()), function (attribute) {
      return attribute.ref === attributeName;
    })[0].dimension;
    const that = this;
    this.rudolfCubesService.members(this.cube, newCutDimension).subscribe(response => {
      that.members.set(newCutDimension.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function (member) {
        return member[attributeName];
      });

      // this.store.dispatch(this.treeActions.replace(expresseionTree));
    });
    /* .catch(() => Observable.of(this.cubeActions.searchComplete([]));*/

  }

  aggregatePageNumberChanged(value) {
    this.newAggregateRequest.page = value;
  }

  aggregatePageSizeChanged(value) {
    this.newAggregateRequest.pageSize = value;
  }

}
