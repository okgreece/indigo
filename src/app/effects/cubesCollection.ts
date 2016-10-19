import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import * as collection from '../actions/cube/collection';
import { Cube } from '../models/cube';


@Injectable()
export class CollectionEffects {
  constructor(private actions$: Actions, private db: Database) { }

  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('cubes_app');
  });

  /**
   * This effect makes use of the `startWith` operator to trigger
   * the effect immediately on startup.
   */
  @Effect()
  loadCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.LOAD)
    .startWith(new collection.LoadAction())
    .switchMap(() =>
      this.db.query('cubes')
        .toArray()
        .map((cubes: Cube[]) => new collection.LoadSuccessAction(cubes))
        .catch(error => of(new collection.LoadFailAction(error)))
    );

  @Effect()
  addCubeToCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.ADD_CUBE)
    .map((action: collection.AddCubeAction) => action.payload)
    .mergeMap(cube =>
      this.db.insert('cubes', [ cube ])
        .map(() => new collection.AddCubeSuccessAction(cube))
        .catch(() => of(new collection.AddCubeFailAction(cube)))
    );


  @Effect()
  removeCubeFromCollection$: Observable<Action> = this.actions$
    .ofType(collection.ActionTypes.REMOVE_CUBE)
    .map((action: collection.RemoveCubeAction) => action.payload)
    .mergeMap(cube =>
      this.db.executeWrite('cubes', 'delete', [ cube.id ])
        .map(() => new collection.RemoveCubeSuccessAction(cube))
        .catch(() => of(new collection.RemoveCubeFailAction(cube)))
    );
}
