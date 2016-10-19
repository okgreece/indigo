import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import * as collection from '../../actions/cube/collection';


export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
};

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export function reducer(state = initialState, action: collection.Actions): State {
  switch (action.type) {
    case collection.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case collection.ActionTypes.LOAD_SUCCESS: {
      const cubes = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: cubes.map(cube => cube.name)
      };
    }

    case collection.ActionTypes.ADD_CUBE_SUCCESS:
    case collection.ActionTypes.REMOVE_CUBE_FAIL: {
      const cube = action.payload;

      if (state.ids.indexOf(cube.name) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [ ...state.ids, cube.name ]
      });
    }

    case collection.ActionTypes.REMOVE_CUBE_SUCCESS:
    case collection.ActionTypes.ADD_CUBE_FAIL: {
      const cube = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== cube.name)
      });
    }

    default: {
      return state;
    }
  }
}


export function getLoaded(state$: Observable<State>) {
  return state$.select(s => s.loaded);
}

export function getLoading(state$: Observable<State>) {
  return state$.select(s => s.loading);
}

export function getCubeIds(state$: Observable<State>) {
  return state$.select(s => s.ids);
}
