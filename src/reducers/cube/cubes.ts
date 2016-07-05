import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { CubeActions } from '../../actions';
import {Cube} from "../../models/cube";


export interface CubesState {
  ids: string[];
  entities: { [id: string]: Cube };
};

const initialState: CubesState = {
  ids: [],
  entities: {}
};

export default function(state = initialState, action: Action): CubesState {
  switch (action.type) {
    case CubeActions.SEARCH_COMPLETE:
    case CubeActions.LOAD_COLLECTION_SUCCESS: {
      const cubes: Cube[] = action.payload;
      const newCubes = cubes.filter(cube => !state.entities[cube.id]);

      const newCubeIds = newCubes.map(cube => cube.id);
      const newCubeEntities = newCubes.reduce((entities: { [id: string]: Cube }, cube: Cube) => {
        return Object.assign(entities, {
          [cube.id]: cube
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newCubeIds ],
        entities: Object.assign({}, state.entities, newCubeEntities)
      };
    }

    case CubeActions.LOAD_CUBE: {
      const cube: Cube = action.payload;

      if (state.ids.includes(cube.id)) {
        return state;
      }

      return {
        ids: [ ...state.ids, cube.id ],
        entities: Object.assign({}, state.entities, {
          [cube.id]: cube
        })
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */
export function getCubeEntities() {
  return (state$: Observable<CubesState>) => state$
    .select(s => s.entities);
};

export function getCube(id: string) {
  return (state$: Observable<CubesState>) => state$
    .select(s => s.entities[id]);
}

export function getCubes(cubeIds: string[]) {
  return (state$: Observable<CubesState>) => state$
    .let(getCubeEntities())
    .map(entities => cubeIds.map(id => entities[id]));
}

export function hasCube(id: string) {
  return (state$: Observable<CubesState>) => state$
    .select(s => s.ids.includes(id));
}
