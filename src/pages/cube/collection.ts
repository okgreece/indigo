import 'rxjs/add/operator/let';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState, getCubeCollection } from '../../reducers';
import { CubePreviewListComponent, CubesInput } from '../../components/cube/cube-preview-list';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';


@Component({
  selector: 'collection-page',
  directives: [ CubePreviewListComponent, MD_CARD_DIRECTIVES ],
  template: `
    <md-card>
      <md-card-title>My Collection</md-card-title>
    </md-card>

    <cube-preview-list [cubes]="cubes$ | async"></cube-preview-list>
  `,
  styles: [`
    md-card-title {
      display: flex;
      justify-content: center;
    }
  `]
})
export class CollectionPage {
  cubes$: Observable<CubesInput>;

  constructor(store: Store<AppState>) {
    this.cubes$ = store.let(getCubeCollection());
  }
}
