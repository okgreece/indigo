import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Database } from '@ngrx/db';

import { AppState } from '../reducers';
import { RudolfCubesService } from '../services/rudolf-cubes';
import { CubeActions } from '../actions/cube';
import {Cube} from "../models/cube";


@Injectable()
export class CubeEffects {
  constructor(
    private updates$: StateUpdates<AppState>,
    private googleCubes: RudolfCubesService,
    private db: Database,
    private cubeActions: CubeActions
  ) { }

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */
  @Effect() openDB$ = this.db.open('cubes_app').filter(() => false);


  @Effect() loadCollectionOnInit$ = Observable.of(this.cubeActions.loadCollection());


  @Effect() loadCollection$ = this.updates$
    .whenAction(CubeActions.LOAD_COLLECTION)
    .switchMapTo(this.db.query('cubes').toArray())
    .map((cubes: Cube[]) => this.cubeActions.loadCollectionSuccess(cubes));


  @Effect() search$ = this.updates$
    .whenAction(CubeActions.SEARCH)
    .map<string>(toPayload)
    .filter(query => query !== '')
    .switchMap(query => this.googleCubes.searchCubes(query)
      .map(cubes => this.cubeActions.searchComplete(cubes))
      .catch(() => Observable.of(this.cubeActions.searchComplete([])))
    );


  @Effect() getCube = this.updates$
    .whenAction(CubeActions.LOAD_CUBE_SUCCESS)
    .map<Cube>(toPayload)
    .mergeMap(cube => { return this.db.insert('cubes', [cube ])
      .mapTo(this.cubeActions.addToCollectionSuccess(cube))
      .catch(() => Observable.of(
        this.cubeActions.addToCollectionFail(cube)
      ))}
    );

  @Effect() clearSearch$ = this.updates$
    .whenAction(CubeActions.SEARCH)
    .map<string>(toPayload)
    .filter(query => query === '')
    .mapTo(this.cubeActions.searchComplete([]));


  @Effect() addCubeToCollection$ = this.updates$
    .whenAction(CubeActions.ADD_TO_COLLECTION)
    .map<Cube>(toPayload)
    .mergeMap(cube => this.db.insert('cubes', [ cube ])
      .mapTo(this.cubeActions.addToCollectionSuccess(cube))
      .catch(() => Observable.of(
        this.cubeActions.addToCollectionFail(cube)
      ))
    );


  @Effect() removeCubeFromCollection$ = this.updates$
    .whenAction(CubeActions.REMOVE_FROM_COLLECTION)
    .map<Cube>(toPayload)
    .mergeMap(cube => this.db.executeWrite('cubes', 'delete', [ cube.name ])
      .mapTo(this.cubeActions.removeFromCollectionSuccess(cube))
      .catch(() => Observable.of(
        this.cubeActions.removeFromCollectionFail(cube)
      ))
    );
}
