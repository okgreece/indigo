import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import { Cube } from '../../models/cube';


@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>My Collection</md-card-title>
    </md-card>

    <bc-cube-preview-list [cubes]="cubes$ | async"></bc-cube-preview-list>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [`
    md-card-title {
      display: flex;
      justify-content: center;
    }
  `]
})
export class CollectionCubePageComponent {
  cubes$: Observable<Cube[]>;

  constructor(store: Store<fromRoot.State>) {
    this.cubes$ = store.let(fromRoot.getCubeCollection);
  }
}
