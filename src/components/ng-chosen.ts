/**
 * Created by larjo on 24/6/2016.
 */
import {Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as $ from "jquery";
import * as _ from 'lodash';
import {NestedPropertyPipe} from "../pipes/nestedProperty";

@Component({
  selector: 'ng-chosen',
  pipes: [NestedPropertyPipe],
  template: `
<select #selectElem (change)="selectedValueChanged.emit(selectElem.value)" class="form-control">
        <option *ngFor="let item of items" [value]="item?.value[valueAccessor]" [selected]="selectedValue==item.value[valueAccessor]?'selected':''" >{{item?.value | nestedProperty:labelAccessor}}</option>
</select>`
})
export class NgChosenComponent implements AfterViewInit {

  @ViewChild('selectElem') el:ElementRef;
  @Input() public items = [];
  @Input() public valueAccessor:string;
  @Input() public labelAccessor:string;



  private _selectedValue:string;


  constructor() {

  }

  get selectedValue():string {

    return this._selectedValue;
  }

  @Input()
  set selectedValue(value:string) {
    this._selectedValue = value;
  }


  @Output()
  selectedValueChanged = new EventEmitter();

  ngAfterViewInit() {
    if (this.items.length>0) {
      this.selectedValueChanged.emit(this.items[_.first(_.keys(this.items))].key);
    }


  }
}
