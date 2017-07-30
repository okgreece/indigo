

import {MdDialogRef} from "@angular/material";
import {PipesModule} from "../../../../pipes/index";
import {ChangeDetectionStrategy, Component, NgModule} from "@angular/core";
import {AggregateRequest} from "../../../../models/aggregate/aggregateRequest";
import {Cube} from "../../../../models/cube";

@Component({
  selector: 'aggregate-preview-dialog',
  template: `
    <div><h1>Aggregate preview ({{json.cells.length}} results)</h1></div>
    <div style="max-height: 400px; overflow: scroll;">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th *ngFor="let col of json.attributes">
            <span
              *ngIf="cube.model.attributes.get(col)">
              {{cube.model.attributes.get(col)?.dimension.label}} - {{cube.model.attributes.get(col)?.label}}</span>
          </th>
          <th *ngFor="let col of json.aggregates">
            <span *ngIf="cube.model.aggregates.get(col)">{{cube.model.aggregates.get(col)?.label}}</span>

          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let item of json.cells">
          <td *ngFor="let col of json.attributes">{{item[col]}}</td>
          <td *ngFor="let col of json.aggregates">{{item[col]}}</td>
        </tr>
        </tbody>

      </table>
    </div>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class  AggregatePreviewDialogComponent {
  public json: any;
  public cube: Cube;
  public request: AggregateRequest;
  constructor(public dialogRef: MdDialogRef<AggregatePreviewDialogComponent>) {
  }
}
