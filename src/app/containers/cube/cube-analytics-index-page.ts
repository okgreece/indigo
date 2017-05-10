import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import {Component, ChangeDetectionStrategy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as cubeActions from '../../actions/cube/cube2';
import * as fromRoot from '../../reducers';
import {
  InCollectionInput,
  AddOutput,
  RemoveOutput
} from '../../components/cube/analytics/cube-analytics-detail';
import {Cube} from '../../models/cube';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'cube-analytics-index-page',

  template: `
   <indigo-cube-analytics-preview-list></indigo-cube-analytics-preview-list>
  `
})
export class CubeAnalyticsIndexComponent {

  isCubeInCollection$: Observable<InCollectionInput>;
  cube: Cube;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    route.params
      .select<string>('id')
      .map(id => new cubeActions.SelectAction(id))
      .subscribe(store);


  }



}
