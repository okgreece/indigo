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
  selector: 'app-linked-pipes-page',
  template: `
    <div fxLayout="row" fxLayoutAlign="center center">

      <div fxFlex="70%" class="content-card">
        <md-card>

          <md-card-content>
            <div Markdown path="assets/linkedpipes/Documentation.md"></div>

          </md-card-content>
        </md-card>
      </div>
    </div>  `
})
export class LinkedPipesPageComponent {

}
