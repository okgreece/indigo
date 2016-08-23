import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, getCubesSearchResults, getCubesSearchQuery } from '../../reducers';
import { CubeActions } from '../../actions';
import { CubeSearchComponent, QueryInput, SearchOutput } from '../../components/cube/cube-search';
import { CubePreviewListComponent, CubesInput } from '../../components/cube/cube-preview-list';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';


@Component({
  selector: 'cube-find-page',
  directives: [
    CubeSearchComponent,
    CubePreviewListComponent,
    MD_CARD_DIRECTIVES
  ],
  template: `
    <md-card>
      <md-card-title>Find a Cube</md-card-title>
      <md-card-content>
      <cube-search [query]="searchQuery$ | async" (search)="search($event)"></cube-search>
      </md-card-content>
    </md-card>
    <cube-preview-list [cubes]="cubes$ | async"></cube-preview-list>
  `,
  styles: [`
    md-card-title,
    md-card-content {
      display: flex;
      justify-content: center;
    }
  `]
})
export class CubeFindPage {
  searchQuery$: Observable<QueryInput>;
  cubes$: Observable<CubesInput>;

  constructor(private store: Store<AppState>, private cubeActions: CubeActions) {
    /**
     * Selectors can be applied with the `let` operator, which passes the source
     * observable to the provided function. This allows us an expressive,
     * composable technique for creating view projections.
     *
     * More on `let`: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35#let
     * More on selectors: https://gist.github.com/btroncone/a6e4347326749f938510#extracting-selectors-for-reuse
     */
    this.searchQuery$ = store.let(getCubesSearchQuery()).take(1);
    this.cubes$ = store.let(getCubesSearchResults());
    this.store.dispatch(this.cubeActions.search(""));

  }

  search(query: SearchOutput) {
    /**
     * All state updates are handled through dispatched actions in 'smart'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our application.
     */
    this.store.dispatch(this.cubeActions.search(query));
  }
}
