import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import * as collection from '../../actions/cube/collection';
import { Cube } from '../../models/cube';


@Component({
  selector: 'bc-selected-cube-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-cube-detail
      [cube]="cube$ | async"
      [inCollection]="isSelectedCubeInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-cube-detail>
  `
})
export class SelectedCubePageComponent {
  cube$: Observable<Cube>;
  isSelectedCubeInCollection$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.cube$ = store.let(fromRoot.getSelectedCube);
    this.isSelectedCubeInCollection$ = store.let(fromRoot.isSelectedCubeInCollection);
  }

  addToCollection(cube: Cube) {
    this.store.dispatch(new collection.AddCubeAction(cube));
  }

  removeFromCollection(cube: Cube) {
    this.store.dispatch(new collection.RemoveCubeAction(cube));
  }
}
