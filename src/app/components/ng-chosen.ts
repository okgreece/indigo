/**
 * Created by larjo on 24/6/2016.
 */
import {Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as $ from "jquery";
import * as _ from 'lodash';
import {NestedPropertyPipe} from "../pipes/nestedProperty";

@Component({
  selector: 'ng-chosen',
  template: `

<select #selectElem [(ngModel)]="selectedItem" (ngModelChange)="onChangeObj($event)">
    <option [ngValue]="item" *ngFor="let item of items">{{item | nestedProperty:labelAccessor}}</option>
 </select>





`



})
export class NgChosenComponent implements AfterViewInit {

  @ViewChild('selectElem') el:ElementRef;
  @Input() public items = [];
  @Input() public valueAccessor:string;
  @Input() public labelAccessor:string;


  onChangeObj(newObj) {
    console.log(newObj);
   // this._selectedItem = newObj;
    this.selectedItemChange.emit(newObj);

    // ... do other stuff here ...
  }

  private _selectedItem: any;



  constructor() {

  }

  get selectedItem():any {

    return this._selectedItem;
  }

  set selectedItem(value:any) {
    /*if(value)
      this.selectedItemChange.emit({value:value});*/
    this._selectedItem = value;
  }


  @Output()
  selectedItemChange = new EventEmitter();

  ngAfterViewInit() {
    if (this.items.length>0) {


      this.selectedItem =this.items[0];

    }


  }
}
