import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import {Component} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as cubeActions from '../../actions/cube/cube2';
import * as fromRoot from '../../reducers';
import {
  InCollectionInput
} from '../../components/cube/analytics/cube-analytics-detail';
import {Cube} from '../../models/cube';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-upload-page',
  template: `
    <div fxLayout="row" fxFlex="100%" fxLayoutAlign="space-around center" >
      <div fxFlex="50%" class="content-card" fxLayoutAlign="space-around center">
        <md-card>
          <md-card-title-group>
            <md-card-title>Upload Data</md-card-title>
            <md-card-subtitle>Select the way you want to upload your data to OpenBudgets.eu</md-card-subtitle>
          </md-card-title-group>
          <md-card-content fxLayoutAlign="space-around center">
            <button md-button [routerLink]="['/upload/linkedpipes']" color="primary"  md-raised-button>LinkedPipes</button>
            <a md-button href="http://apps.openbudgets.eu/packager" color="primary"  md-raised-button>OpenSpending Packager</a>
          </md-card-content>
        </md-card>
      </div>
    </div>
  `
})
export class UploadPageComponent {

}
