/**
 * Created by larjo on 27/9/2016.
 */

import * as _ from 'lodash';
import {ApiCubesService} from '../../services/api-cubes';

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Output, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild, EventEmitter
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
import {Dimension} from '../../models/dimension';
import {FactRequest} from '../../models/fact/factRequest';


@Component({

  selector: 'fact-request-builder',
  changeDetection: ChangeDetectionStrategy.Default, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fact-request-builder.html',
  styles: [`

    form{
      margin: 30px 0 0;
    }

  ul.alt-list{padding:0; margin:10px 0}
    ul.alt-list li {
      list-style-type: none;
      margin: .1rem 0;
      padding: .1rem;
      display: flex;
      align-items: center;


    }
    ul.alt-list li:nth-child(odd) { background: #f8f8f8; }{

    }

    a.action-anchor{
      cursor:pointer;
      margin: auto 10px ;

    }

    .md-tab-label{
      min-width:max-content!important;

    }

    md-toolbar-row [md-mini-fab]{
      margin:2px;

    }

    .md-tab-body-wrapper{

      max-height:700px;
      overflow-y:auto!important;

    }

    span.node-key {
      cursor: pointer;
    }
    .well {
  background-color: #615f5f;
}

  `]
})
export class FactRequestBuilder {


  @Output()
  public onRequestBuilt: EventEmitter<FactRequest> = new EventEmitter<FactRequest>();

  public get cube(){
    return this._cube;
  }

  @Input()
  public set cube(value: Cube){
    const that = this;
    that._cube = value;
  }
  _cube: Cube;



  @Output() requestChange = new EventEmitter();


  public get request(): FactRequest{
    return this.newFactRequest;
  }

  @Input()
  public set request(value: FactRequest){
    const that = this;
    that.newFactRequest = value;
  }



  constructor(private rudolfCubesService: ApiCubesService) {

  }


  newFactRequest: FactRequest = new FactRequest();







  addCut() {
    const newCut = new Cut();
    newCut.column = this.newCutAttribute;
    newCut.transitivity = this.newCutTransitivity;
    newCut.value = this.newCutValueVal;
    this.newFactRequest.cuts.push(newCut);
  }


  removeCut(cut: Cut) {
    _.remove(this.newFactRequest.cuts, cut);
  }



  addSort() {
    const newSort = new Sort();
    newSort.column = this.newSortAttribute;
    newSort.direction = this.newSortDirection;
    this.newFactRequest.sorts.push(newSort);
  }

  removeSort(sort: Sort) {
    _.remove(this.newFactRequest.sorts, sort);
  }

  selectedCutChanged($event: Attribute) {
    this.newCutValueVal = '';
    this.newCutAttribute = $event;
    this.getMembers($event.ref);
  }

  selectedCutValChanged(search: string) {
    this.searchMembers(this.newCutAttribute, search);
  }


  addField() {
    const newField = this.newField;
    this.newFactRequest.fields.push(newField);

    this.newFactRequest.emitFieldChanges();

  }

  removeField(field: Attribute) {
    _.remove(this.newFactRequest.fields, field);
    this.newFactRequest.emitFieldChanges();

  }



  newSortAttribute: Attribute;

  newDrilldownAttribute: Attribute;

  newCutAttribute: Attribute;

  newCutValueVal: string;

  newSortDirection: SortDirection;

  newField: Attribute;

  sortDirections: Map<string, SortDirection> = SortDirection.directions;
  public newFactPageNumber = 0;
  public newFactPageSize = 30;

  setCutValue(member: string) {
    this.newCutValueVal = member;
  }
  members: Map<string, Map<string, Object>> = new Map<string, Map<string, Object>>();

  cutMembers: string[]= [];

  transitivities: Transitivity[] = Transitivity.staticFactory();

  newCutTransitivity: Transitivity = this.transitivities[0];


  searchMembers(attribute: Attribute, search: string) {
    if (!attribute) return;
    const that = this;
    this.rudolfCubesService.members(this.cube, attribute.dimension).subscribe(response => {
      that.members.set(attribute.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function(member){
        return member[attribute.ref];
      }).filter(function (value) {
        return value && (search === '' || search === undefined || search == null || value.indexOf(search) > -1);
      });

    });
  }

  factPageNumberChanged(value) {
    this.newFactRequest.page = value;
  }

  factPageSizeChanged(value) {
    this.newFactRequest.pageSize = value;
  }

  getMembers(attributeName: string) {

    const newCutDimension = _.filter(Array.from(this.cube.model.attributes.values()), function (attribute) {
      return attribute.ref === attributeName;
    })[0].dimension;
    const that = this;
    this.rudolfCubesService.members(this.cube, newCutDimension).subscribe(response => {
      that.members.set(newCutDimension.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function(member){
        return member[attributeName];
      });

    });

  }


}
