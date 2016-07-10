/**
 * Created by larjo on 24/6/2016.
 */
import {Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as $ from "jquery";
import * as _ from 'lodash';

@Component({
  selector: 'ng-chosen',
  template: `<select #selectElem class="form-control">
        <option *ngFor="let item of items" [value]="item.value[valueAccessor]" [selected]="item == selectedValue">{{item.value[labelAccessor]}}</option>
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
    this.selectedValueChanged.emit({value: value});
  }


  @Output()
  selectedValueChanged = new EventEmitter();

  ngAfterViewInit() {
    if (!this.selectedValue) {
      this.selectedValue = this.items[_.first(_.keys(this.items))].key;
    }
    $(this.el.nativeElement)
    //.chosen()
      .on('change', (e, args) => {
        // debugger;
        this.selectedValue = $(e.target).children("option:selected").attr("value");
      });

  }
}
