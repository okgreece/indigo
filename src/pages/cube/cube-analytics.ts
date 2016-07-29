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
} from '../../components/cube/cube-analytics-detail';
import {CubeAnalyticsDetailComponent} from "../../components/cube/cube-analytics-detail";
import {Cube} from "../../models/cube";


@Component({
  selector: 'cube-analytics-page',
  directives: [ CubeAnalyticsDetailComponent ],
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
  cube$: Observable<CubeInput>;
  isCubeInCollection$: Observable<InCollectionInput>;
  cube:Cube;

  constructor(
    private store: Store<AppState>,
    private cubeActions: CubeActions,
    private routeParams$: RouteParams
  ) {
    this.cube$ = routeParams$
      .select<string>('id')
      .switchMap(id => {return store.let(getCube(id));});




    this.isCubeInCollection$ = routeParams$
      .select<string>('id')
      .switchMap(id =>{ return store.let(isCubeInCollection(id));});

    let that = this;
  //  this.cube$.subscribe((cube)=>{that.cube = cube;});
  }

  addToCollection(cube: AddOutput) {
    this.store.dispatch(this.cubeActions.addToCollection(cube));
  }

  removeFromCollection(cube: RemoveOutput) {
    this.store.dispatch(this.cubeActions.removeFromCollection(cube));
  }
}
