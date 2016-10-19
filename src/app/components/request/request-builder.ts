/**
 * Created by larjo on 27/9/2016.
 */

import * as _ from 'lodash';
import {RudolfCubesService} from "../../services/rudolf-cubes";

import {
  ChangeDetectionStrategy, ViewEncapsulation,
  Component, Input, Output,Directive, Attribute as MetadataAttribute, OnChanges, DoCheck, ElementRef, OnInit, SimpleChange,
  AfterViewInit, ViewChild, EventEmitter
} from '@angular/core';
import {Aggregate} from "../../models/aggregate";
import {Sort} from "../../models/sort";
import {Attribute} from "../../models/attribute";
import {SortDirection} from "../../models/sortDirection";
import {Transitivity} from "../../models/transitivity";
import {Drilldown} from "../../models/drilldown";
import {Cut} from "../../models/cut";
import {AggregateParam} from "../../models/aggregateParam";
import {AggregateRequest} from "../../models/aggregate/aggregateRequest";
import {AggregateNode} from "../../models/aggregate/aggregateNode";
import {Cube} from "../../models/cube";
import {Dimension} from "../../models/dimension";


@Component({
  moduleId: 'request-builder',

  selector: 'request-builder',
  changeDetection: ChangeDetectionStrategy.Default, // ⇐⇐⇐
  encapsulation: ViewEncapsulation.None,
  template: require('./request-builder.html'),
  styles: [`
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
  `]
})
export class RequestBuilder{
  get newAggregateAggregate(): Aggregate {
    return this._newAggregateAggregate;
  }

  set newAggregateAggregate(value: Aggregate) {
    this._newAggregateAggregate = value;
  }


  @Output()
  public onRequestBuilt : EventEmitter<AggregateRequest> = new EventEmitter<AggregateRequest>();

  public get cube(){
    return this._cube;
  }

  @Input()
  public set cube(value:Cube){
    let that = this;
    that._cube = value;
  }
  _cube:Cube;

  constructor(private rudolfCubesService:RudolfCubesService){
  }


  newAggregateRequest:AggregateRequest = new AggregateRequest();

  addAggregateChild() {


    let aggregateNode = new AggregateNode();
    aggregateNode.element = this.newAggregateRequest;
    this.newAggregateRequest.cube = this.cube;
    this.newAggregateRequest.page = this.newAggregatePageNumber;
    this.newAggregateRequest.pageSize = this.newAggregatePageSize;


    this.onRequestBuilt.emit(this.newAggregateRequest);
    this.newAggregateRequest = new AggregateRequest;
    this.newAggregateRequest.cube = this.cube;
  }


  addAggregate() {
    let newAggregate = new AggregateParam();
    newAggregate.column = this._newAggregateAggregate;
    this.newAggregateRequest.aggregates.push(newAggregate);

  }


  removeAggregate(aggregate: AggregateParam){
    _.remove(this.newAggregateRequest.aggregates, aggregate);
  }

  addCut() {
    let newCut = new Cut();
    newCut.column = this.newCutAttribute;
    newCut.transitivity = this.newCutTransitivity;
    newCut.value = this.newCutValueVal;
    this.newAggregateRequest.cuts.push(newCut);
  }


  removeCut(cut: Cut){
    _.remove(this.newAggregateRequest.cuts, cut);
  }

  addDrilldown() {
    let newDrilldown = new Drilldown();
    newDrilldown.column = this.newDrilldownAttribute;
    this.newAggregateRequest.drilldowns.push(newDrilldown);
  }


  removeDrilldown(drilldown: Drilldown){
    _.remove(this.newAggregateRequest.drilldowns, drilldown);
  }

  addSort() {

    let newSort = new Sort();
    newSort.column = this.newSortAttribute;
    newSort.direction = this.newSortDirection;
    this.newAggregateRequest.sorts.push(newSort);
  }

  removeSort(sort: Sort){
    _.remove(this.newAggregateRequest.sorts, sort);
  }

  selectedCutChanged($event: Attribute){
    this.newCutValueVal = "";
    this.newCutAttribute = $event;
    this.getMembers($event.ref);
  }

  selectedCutValChanged(search:string){
    this.searchMembers(this.newCutAttribute, search);
  }


  private _newAggregateAggregate:Aggregate ;

  newSortAttribute:Attribute;

  newDrilldownAttribute:Attribute;

  newCutAttribute:Attribute;

  newCutValueVal:string;

  newSortDirection:SortDirection;

  newCustomValue: any;

  sortDirections:Map<string,SortDirection> = SortDirection.directions;
  public newAggregatePageNumber: number = 0;
  public newAggregatePageSize: number = 30;

  setCutValue(member:string){
    this.newCutValueVal = member;
  }
  members:Map<string, Map<string,Object>> = new Map<string, Map<string,Object>>();

  cutMembers:string[]=[];

  transitivities:Transitivity[] = Transitivity.staticFactory();

  newCutTransitivity: Transitivity = this.transitivities[0];


  searchMembers(attribute:Attribute, search: string){
    if(!attribute) return;
    let that = this;
    this.rudolfCubesService.members(this.cube, attribute.dimension).subscribe(response=> {
      that.members.set(attribute.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function(member){
        return member[attribute.ref];
      }).filter(function (value) {
        return value&& (search==""|| search==undefined || search==null || value.indexOf(search)>-1);
      });

    });
  }

  getMembers(attributeName:string) {

    let newCutDimension = _.filter(Array.from(this.cube.model.attributes.values()), function (attribute) {
      return attribute.ref == attributeName;
    })[0].dimension;
    let that = this;
    this.rudolfCubesService.members(this.cube, newCutDimension).subscribe(response=> {
      that.members.set(newCutDimension.ref, response);

      that.cutMembers = _.map(Array.from(response.values()), function(member){
        return member[attributeName];
      });

      //this.store.dispatch(this.treeActions.replace(expresseionTree));
    });
    /* .catch(() => Observable.of(this.cubeActions.searchComplete([]));*/

  }

}
