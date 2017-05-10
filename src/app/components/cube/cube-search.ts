import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import {Component, Output, Input, EventEmitter, AfterViewInit} from '@angular/core';


@Component({
  selector: 'indigo-cube-search',
  template: `
    <md-card>
      <md-card-title>Find a Dataset</md-card-title>
      <md-card-content>
        <md-input-container>
          <input mdInput placeholder="Search for a dataset" [value]="query" (keyup)="search.emit($event.target.value)"/>
        </md-input-container>
       
        <md-spinner *ngIf="searching" [class.show]="searching"></md-spinner>
      </md-card-content>
    </md-card>
  `,
  styles: [`
    md-card-title,
    md-card-content {
      display: flex;
      justify-content: center;
    }

    md-input {
      display: flex;
      justify-content: center;
    }

    md-card-spinner {
      padding-left: 60px; // Make room for the spinner
    }

    md-spinner {
      width: 30px;
      height: 30px;
      position: relative;
      top: 10px;
      left: 10px;
      opacity: 0.0;
    }

    md-spinner.show {
      opacity: 1.0;
    }
    
  
  `]
})
export class CubeSearchComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    this.search.emit('');

  }
  @Input() query: string = '';
  @Input() searching = false;
  @Output() search = new EventEmitter<string>();

}
