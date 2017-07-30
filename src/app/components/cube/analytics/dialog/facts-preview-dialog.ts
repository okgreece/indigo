import {ChangeDetectionStrategy, Component, NgModule} from '@angular/core';
import {PipesModule} from '../../../../pipes/index';
import {MdDialogRef} from '@angular/material';
import {Cube} from '../../../../models/cube';
import {FactRequest} from '../../../../models/fact/factRequest';


@Component({
  selector: 'facts-preview-dialog',
  template: `
    <div><h1>Facts preview ({{json.data.length}} records)</h1></div>
    <div style="max-height: 400px; overflow: scroll;">
      <table class="table table-bordered">
        <thead>
        <tr>
          <th *ngFor="let col of json.fields">
            <span
              *ngIf="cube.model.attributes.get(col)">
              {{cube.model.attributes.get(col)?.dimension.label}} - {{cube.model.attributes.get(col)?.label}}</span>
            <span *ngIf="cube.model.measures.get(col)">{{cube.model.measures.get(col)?.label}}</span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let item of json.data">
          <td *ngFor="let col of json.fields">{{item[col]}}</td>
        </tr>
        </tbody>

      </table>
    </div>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class FactsPreviewDialogComponent {
  public json: any;
  public cube: Cube;
  public request: FactRequest;

  constructor(public dialogRef: MdDialogRef<FactsPreviewDialogComponent>) {
  }

}
