import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { RudolfCubesService } from '../services/rudolf-cubes';
import * as fromRoot from '../reducers';
import * as cube from '../actions/cube/cube2';


/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class CubeExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromRoot.State>,
    private rudolfCubes: RudolfCubesService,
    private router: Router
  ) { }

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCollectionToLoad(): Observable<boolean> {
    return this.store.let(fromRoot.getCollectionLoaded)
      .filter(loaded => loaded)
      .take(1);
  }

  /**
   * This method checks if a cube with the given ID is already registered
   * in the Store
   */
  hasCubeInStore(id: string): Observable<boolean> {
    return this.store.let(fromRoot.getCubeEntities)
      .map(entities => !!entities[id])
      .take(1);
  }

  /**
   * This method loads a cube with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasCubeInApi(id: string): Observable<boolean> {
    return this.rudolfCubes.retrieveCube(id)
      .map(cubeEntity => new cube.LoadAction(cubeEntity))
      .do(action => this.store.dispatch(action))
      .map(cube => !!cube)
      .catch(() => {
        this.router.navigate(['/404']);
        return of(false);
      });
  }

  /**
   * `hasCube` composes `hasCubeInStore` and `hasCubeInApi`. It first checks
   * if the cube is in store, and if not it then checks if it is in the
   * API.
   */
  hasCube(id: string): Observable<boolean> {

    return this.hasCubeInStore(id)
      .switchMap(inStore => {
       /* if (inStore) {
          return of(inStore);
        }*/
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
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.waitForCollectionToLoad()
      .switchMap(() => this.hasCube(route.params['id']));
  }
}
