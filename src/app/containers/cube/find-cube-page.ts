import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import * as cube from '../../actions/cube/cube2';
import {Cube} from '../../models/cube';
import {environment} from "../../../environments/environment";


@Component({
  selector: 'bc-find-cube-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <indigo-cube-search [query]="searchQuery$ | async" [searching]="loading$ | async"
                        (search)="search($event)"></indigo-cube-search>
    <indigo-cube-preview-list appInfiniteScroller
                              scrollPerecnt="70"
                              immediateCallback="true"
                              [scrollCallback]="scrollCallback" [cubes]="cubes$ | async"></indigo-cube-preview-list>
  `,
  styles: [`
    indigo-cube-preview-list {
      margin-top: 20px;
      display: block;
    }


  `]
})
export class FindCubePageComponent {
  searchQuery$: Observable<string>;
  cubes$: Observable<Cube[]>;
  loading$: Observable<boolean>;
  private query: string;
  private currentPage = 0;

  constructor(private store: Store<fromRoot.State>) {
    this.searchQuery$ = store.let(fromRoot.getCubeSearchQuery).take(1);
    this.cubes$ = store.let(fromRoot.getCubeSearchResults);
    this.loading$ = store.let(fromRoot.getCubeSearchLoading);
    this.searchQuery$.subscribe(query => this.query = query);
    this.scrollCallback = this.getCubes.bind(this);

  }

  scrollCallback;


  search(query: string, size?: number, from?: number) {
    if (!from) from = 0;
    if (!size) size = environment.searchSize;
    this.store.dispatch(new cube.SearchAction({query: query, from: from, size: size}));
    this.query = query;
  }

  scrolled() {
    this.currentPage++;
    this.store.dispatch(new cube.SearchAction({
      query: this.query,
      from: this.currentPage * environment.searchSize,
      size: environment.searchSize
    }));
    return this.cubes$;

  }

  getCubes() {
    this.scrolled();
    return Observable.range(0, 3)
      .delay(1000);
  }
}
