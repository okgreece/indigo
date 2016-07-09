/**
 * Created by larjo on 24/6/2016.
 */
import {Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
declare let $:JQueryStatic;

@Component({
  selector: 'ng-chosen',
  template: `<select #selectElem>
        <option *ngFor="let item of items" [value]="item[valueAccessor]" [selected]="item[valueAccessor] === selectedValue">{{item[labelAccessor]}}</option>
        </select>
        <h4>{{selectedValue}}</h4>`
})
export class NgChosenComponent implements AfterViewInit {

  @ViewChild('selectElem') el:ElementRef;
  @Input() public items = [];
  @Input() public valueAccessor:string;
  @Input() public labelAccessor:string;

  private _selectedValue:string;

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
    $(this.el.nativeElement)
      .chosen()
      .on('change', (e, args) => {
        this.selectedValue = args.selected;
      });
  }
}
