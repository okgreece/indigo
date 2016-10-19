import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { RudolfCubesService } from '../services/rudolf-cubes';
import * as cube from '../actions/cube/cube2';


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

@Injectable()
export class CubeEffects {
  constructor(private actions$: Actions, private rudolfCubes: RudolfCubesService) { }


  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(cube.ActionTypes.SEARCH)
    .debounceTime(300)
    .map<string>(action => action.payload)
    .switchMap(query => {
      if (query === '') {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(cube.ActionTypes.SEARCH).skip(1);

      return this.rudolfCubes.searchCubes(query)
        .takeUntil(nextSearch$)
        .map(cubes => {return new cube.SearchCompleteAction(cubes.filter(function (cube) {
          if(query=="")return true;
          return cube.name.indexOf(query)>-1;
        }));})
        .catch(() => of(new cube.SearchCompleteAction([])));
    });



}
