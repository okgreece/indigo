import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { RouteParams } from '@ngrx/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, getCube, isCubeInCollection } from '../../reducers';
import { CubeActions } from '../../actions/cube';
import {
  CubeDetailComponent,
  CubeInput,
  InCollectionInput,
  AddOutput,
  RemoveOutput
} from '../../components/cube/cube-detail';


@Component({
  selector: 'cube-view-page',
  directives: [ CubeDetailComponent ],
  template: `
    <cube-detail
      [cube]="cube$ | async"
      [inCollection]="isCubeInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </cube-detail>
  `
})
export class CubeViewPage {
  cube$: Observable<CubeInput>;
  isCubeInCollection$: Observable<InCollectionInput>;

  constructor(
    private store: Store<AppState>,
    private cubeActions: CubeActions,
    private routeParams$: RouteParams
  ) {
    this.cube$ = routeParams$
      .select<string>('id')
      .switchMap(id => store.let(getCube(id)));

    this.isCubeInCollection$ = routeParams$
      .select<string>('id')
      .switchMap(id => store.let(isCubeInCollection(id)));
  }

  addToCollection(cube: AddOutput) {
    this.store.dispatch(this.cubeActions.addToCollection(cube));
  }

  removeFromCollection(cube: RemoveOutput) {
    this.store.dispatch(this.cubeActions.removeFromCollection(cube));
  }
}
