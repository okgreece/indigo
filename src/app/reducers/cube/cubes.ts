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

export function reducer(state = initialState, action: cube.Actions | collection.Actions | any): State {
  switch (action.type) {
    case cube.ActionTypes.SEARCH_CUBE_COMPLETE:
    case collection.ActionTypes.LOAD_CUBE_SUCCESS: {
      const packages: any = action.payload.cubes;
      let newPackages = [];
      if ( action.payload.params !== undefined && action.payload.params.from < 2 ) {
        newPackages = [...packages];
      } else {
        newPackages = packages.filter(pckg => !state.entities[pckg.id]);
      }
      const newPackageIds = newPackages.map(pckg => pckg.id);
      const newCubeEntities = newPackages.reduce((entities: { [id: string]: any }, pckg: any) => {
        return Object.assign(entities, {
          [pckg.id]: {pckg: pckg.package, id: pckg.id}
        });
      }, {});
      const entities  = Object.assign({}, state.entities, newCubeEntities);

      let ids = [];
      if (action.payload.params !== undefined && action.payload.params.from < 2 ) {
        ids = [ ...newPackageIds ];
      } else {
        ids = [ ...state.ids, ...newPackageIds ];
      }

      return {
        ids: ids,
        entities: entities,
        selectedCubeId: state.selectedCubeId
      };
    }

    case cube.ActionTypes.LOAD_CUBE: {
      const cube = action.payload;
/*      if (state.ids.indexOf(cube.name) > -1) {
        return state;
      }*/
      const mergedCube = Object.assign({}, state.entities[cube.name], cube);
      return {
        ids: [ ...state.ids, cube.name ],
        entities: Object.assign({}, state.entities, {
          [cube.name]: mergedCube
        }),
        selectedCubeId: state.selectedCubeId
      };
    }

    case cube.ActionTypes.SELECT_CUBE: {
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
    const cube = new Cube().deserialize(entities[selectedCubeId]);
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
