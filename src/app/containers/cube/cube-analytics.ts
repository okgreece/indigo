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
} from '../../components/cube/cube-analytics-detail';
import {Cube} from "../../models/cube";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'cube-analytics-page',

  template: `
    <cube-analytics-detail
      [cube]="cube$|async"
      [inCollection]="isCubeInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </cube-analytics-detail>
  `
})
export class CubeAnalyticsPage {
  cube$: Observable<Cube>;
  isCubeInCollection$: Observable<InCollectionInput>;
  cube:Cube;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    let that = this;
    route.params
      .select<string>('id')
      .map(id => new cubeActions.SelectAction(id))
      .subscribe(store);


  }



}
