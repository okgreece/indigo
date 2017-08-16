import {ChangeDetectionStrategy, Component, NgModule, OnInit} from '@angular/core';
import {PipesModule} from '../../../../pipes/index';
import {MdDialogRef} from '@angular/material';
import {Cube} from '../../../../models/cube';
import {FactRequest} from '../../../../models/fact/factRequest';
import {CdkTableModule} from '@angular/cdk';
import {FactsDataset, FactsDataSource} from './FactsDataSource';


@Component({
  selector: 'facts-preview-dialog',
  template: `
    <div><h1>Facts preview ({{json.data.length}} records)</h1></div>


      <md-table #table [dataSource]="dataSource">



        <ng-container *ngFor="let item of cube.model.attributes | iterable"  [cdkColumnDef]="item.ref">
          <md-header-cell *cdkHeaderCellDef> {{item.dimension.label}} &rarr; {{item.label}} </md-header-cell>
          <md-cell *cdkCellDef="let row"> {{row[item.ref]}} </md-cell>
        </ng-container>



        <ng-container *ngFor="let item of cube.model.measures | iterable"  [cdkColumnDef]="item.ref">
          <md-header-cell *cdkHeaderCellDef> {{item.label}} </md-header-cell>
          <md-cell *cdkCellDef="let row"> {{row[item.ref]}} </md-cell>
        </ng-container>


        <md-header-row *cdkHeaderRowDef="displayedColumns"></md-header-row>
        <md-row *cdkRowDef="let row; columns: displayedColumns;"></md-row>

      </md-table>

    

  `,
  changeDetection: ChangeDetectionStrategy.Default

})

export class FactsPreviewDialogComponent implements OnInit {
  get json(): any {
    return this._json;
  }
  dataSource: FactsDataSource | null;
  factsDatabase: FactsDataset;
  displayedColumns = ['amount'];

  set json(value: any) {
    this._json = value;
    this.factsDatabase = new FactsDataset(value.data);
    this.displayedColumns = value.fields;

  }
  private _json: any;
  public cube: Cube;
  public request: FactRequest;

  constructor(public dialogRef: MdDialogRef<FactsPreviewDialogComponent>) {
  }

  ngOnInit() {
    this.dataSource = new FactsDataSource(this.factsDatabase);

  }

}

