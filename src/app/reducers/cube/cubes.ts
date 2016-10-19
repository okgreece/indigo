import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Cube } from '../../models/cube';
import * as cube from '../../actions/cube/cube2';
import * as collection from '../../actions/cube/collection';


export interface State {
  ids: string[];
  entities: { [id: string]: Cube };
  selectedCubeId: string | null;
}

const initialState: State = {
  ids: [],
  entities: {},
  selectedCubeId: null,
};

export function reducer(state = initialState, action: cube.Actions | collection.Actions): State {
  switch (action.type) {
    case cube.ActionTypes.SEARCH_COMPLETE:
    case collection.ActionTypes.LOAD_SUCCESS: {
      const cubes = action.payload;
      const newCubes = cubes.filter(cube => !state.entities[cube.name]);

      const newCubeIds = newCubes.map(cube => cube.name);
      const newCubeEntities = newCubes.reduce((entities: { [id: string]: Cube }, cube: Cube) => {
        return Object.assign(entities, {
          [cube.name]: cube
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newCubeIds ],
        entities: Object.assign({}, state.entities, newCubeEntities),
        selectedCubeId: state.selectedCubeId
      };
    }

    case cube.ActionTypes.LOAD: {
      const cube = action.payload;

      if (state.ids.indexOf(cube.name) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, cube.name ],
        entities: Object.assign({}, state.entities, {
          [cube.name]: cube
        }),
        selectedCubeId: state.selectedCubeId
      };
    }

    case cube.ActionTypes.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedCubeId: action.payload
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

export function getCubeEntities(state$: Observable<State>) {
  return state$.select(state => state.entities);
}

export function getCubeIds(state$: Observable<State>) {
  return state$.select(state => state.ids);
}

export function getSelectedCubeId(state$: Observable<State>) {
  return state$.select(state => state.selectedCubeId);
}

export function getSelectedCube(state$: Observable<State>) {

  return combineLatest<{ [id: string]: Cube }, string>(
    state$.let(getCubeEntities),
    state$.let(getSelectedCubeId)
  )
  .map(([ entities, selectedCubeId ]) => {
    let cube = new Cube().deserialize(entities[selectedCubeId]);
    return  cube;

    });
}


export function getCube(state$: Observable<State>) {

  return combineLatest<{ [id: string]: Cube }, string>(
    state$.let(getCubeEntities),
    state$.let(getSelectedCubeId)
  )
  .map(([ entities, selectedCubeId ]) => {
    let cube = new Cube().deserialize(entities[selectedCubeId]);
    return  cube;

    });
}

export function getAllCubes(state$: Observable<State>) {
  return combineLatest<{ [id: string]: Cube }, string[]>(
    state$.let(getCubeEntities),
    state$.let(getCubeIds)
  )
  .map(([ entities, ids ]) => ids.map(id => entities[id]));
}
