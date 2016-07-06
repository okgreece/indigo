import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/concat';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guard, TraversalCandidate } from '@ngrx/router';
import { Observable } from 'rxjs/Observable';

import { GoogleCubesService } from '../services/google-cubes';
import { AppState, hasCube, getCubesCollectionLoaded } from '../reducers';
import { CubeActions } from '../actions/cube';


/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's traversal process whether the route should continue
 * to be considered a candidate route. Guards must return an observable of
 * true or false.
 *
 * More on guards: https://github.com/ngrx/router/blob/master/docs/overview/guards.md
 */
@Injectable()
export class CubeExistsGuard implements Guard {
  constructor(
    private store: Store<AppState>,
    private googleCubes: GoogleCubesService,
    private cubeActions: CubeActions
  ) { }

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCollectionToLoad() {
    return this.store.let(getCubesCollectionLoaded())
      .filter(loaded => loaded)
      .take(1);
  }

  /**
   * This method checks if a cube with the given ID is already registered
   * in the Store
   */
  hasCubeInStore(id: string) {
    return this.store.let(hasCube(id)).take(1);
  }

  /**
   * This method loads a cube with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasCubeInApi(id: string) {
    return this.googleCubes.retrieveCube(id)
      .map(cube => this.cubeActions.loadCube(cube))
      .do(action => this.store.dispatch(action))
      .map(cube => !!cube)
      .catch(() => Observable.of(false));
  }

  /**
   * `hasCube` composes `hasCubeInStore` and `hasCubeInApi`. It first checks
   * if the cube is in store, and if not it then checks if it is in the
   * API.
   */
  hasCube(id: string) {
    return this.hasCubeInStore(id)
      .switchMap(inStore => {
        if (inStore) {
          return Observable.of(inStore);
        }

        return this.hasCubeInApi(id);
      });
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a cube from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  protectRoute({ routeParams: { id } }: TraversalCandidate) {
    return this.waitForCollectionToLoad()
      .switchMapTo(this.hasCube(id));
  }
}
