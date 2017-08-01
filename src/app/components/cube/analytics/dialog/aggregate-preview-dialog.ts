

import {MdDialogRef} from "@angular/material";
import {PipesModule} from "../../../../pipes/index";
import {ChangeDetectionStrategy, Component, NgModule, OnInit} from "@angular/core";
import {AggregateRequest} from "../../../../models/aggregate/aggregateRequest";
import {Cube} from "../../../../models/cube";
import {CdkTableModule} from '@angular/cdk';
import {AggregatesDataset, AggregatesDataSource} from "./AggregatesDataSource";
import * as _ from 'lodash';

@Component({
  selector: 'aggregate-preview-dialog',
  template: `
    <div><h1>Aggregate preview ({{json.cells.length}} results)</h1></div>



    <md-table #table [dataSource]="dataSource">



      <ng-container *ngFor="let item of cube.model.attributes | iterable"  [cdkColumnDef]="item.ref">
        <md-header-cell *cdkHeaderCellDef> {{item.dimension.label}} &rarr; {{item.label}} </md-header-cell>
        <md-cell *cdkCellDef="let row"> {{row[item.ref]}} </md-cell>
      </ng-container>



      <ng-container *ngFor="let item of cube.model.aggregates | iterable"  [cdkColumnDef]="item.ref">
        <md-header-cell *cdkHeaderCellDef> {{item.label}} </md-header-cell>
        <md-cell *cdkCellDef="let row"> {{row[item.ref]}} </md-cell>
      </ng-container>


      <md-header-row *cdkHeaderRowDef="displayedColumns"></md-header-row>
      <md-row *cdkRowDef="let row; columns: displayedColumns;"></md-row>

    </md-table>

  `,
  changeDetection: ChangeDetectionStrategy.Default
})


export class  AggregatePreviewDialogComponent implements OnInit {
  get json(): any {
    return this._json;
  }
  dataSource: AggregatesDataSource | null;
  aggregatesDataset: AggregatesDataset;
  displayedColumns = ['amount.sum'];

  set json(value: any) {
    this._json = value;
    this.aggregatesDataset = new AggregatesDataset(value.cells);
    this.displayedColumns = _.concat(value.attributes, value.aggregates);
  }
  private _json: any;
  public cube: Cube;
  public request: AggregateRequest;
  constructor(public dialogRef: MdDialogRef<AggregatePreviewDialogComponent>) {
  }


  ngOnInit() {
    this.dataSource = new AggregatesDataSource(this.aggregatesDataset);

  }
}
