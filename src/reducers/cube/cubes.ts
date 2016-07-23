import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { CubeActions } from '../../actions';
import {Cube} from "../../models/cube";
import {plainToConstructor, plainToConstructorArray} from "constructor-utils";
import {TypedJSON} from "typedjson/src/typed-json";


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
      const newCubes = cubes.filter(cube => !state.entities[cube.name]);
      const newCubeIds = newCubes.map(cube => cube.name);
      const newCubeEntities = newCubes.reduce((entities: { [name: string]: Cube }, cube: Cube) => {
        return Object.assign(entities, {
          [cube.name]: cube
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newCubeIds ],
        entities: Object.assign({}, state.entities, newCubeEntities)
      };
    }

    case CubeActions.LOAD_CUBE: {
      const cube: Cube = action.payload;

      if (state.ids.includes(cube.name)) {
        return state;
      }

      return {
        ids: [ ...state.ids, cube.name ],
        entities: Object.assign({}, state.entities, {
          [cube.name]: cube
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
}

export function getCube(id: string) {
  return (state$: Observable<CubesState>) => state$
    .select(s => {
      let cube = new Cube().deserialize(s.entities[id]);
      return  cube;


    });
}

export function getCubes(cubeIds: string[]) {
  return (state$: Observable<CubesState>) => state$
    .let(getCubeEntities())
    .map(entities => {return cubeIds.map(id => entities[id])});
}

export function hasCube(id: string) {
  return (state$: Observable<CubesState>) => state$
    .select(s => s.ids.includes(id));
}
