import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import * as cube from '../../actions/cube/cube2';
import { Cube } from '../../models/cube';


@Component({
  selector: 'bc-find-cube-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <indigo-cube-search [query]="searchQuery$ | async" [searching]="loading$ | async" (search)="search($event)"></indigo-cube-search>
    <indigo-cube-preview-list [cubes]="cubes$ | async"></indigo-cube-preview-list>
  `,
  styles:[`
  indigo-cube-preview-list{
  margin-top:20px;
  display: block;
  }


`]
})
export class FindCubePageComponent {
  searchQuery$: Observable<string>;
  cubes$: Observable<Cube[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.searchQuery$ = store.let(fromRoot.getCubeSearchQuery).take(1);
    this.cubes$ = store.let(fromRoot.getCubeSearchResults);
    this.loading$ = store.let(fromRoot.getCubeSearchLoading);
  }

  search(query: string) {
    this.store.dispatch(new cube.SearchAction(query));
  }
}
