import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import * as cube from '../../actions/cube/cube2';


export interface State {
  ids: string[];
  loading: boolean;
  query: string;
}

const initialState: State = {
  ids: [],
  loading: false,
  query: ''
};

export function reducer(state = initialState, action: cube.Actions): State {
  switch (action.type) {
    case cube.ActionTypes.SEARCH: {
      const query = action.payload;

      if (query === '') {
        return {
          ids: [],
          loading: false,
          query
        };
      }

      return Object.assign({}, state, {
        query,
        loading: true
      });
    }

    case cube.ActionTypes.SEARCH_COMPLETE: {
      const cubes = action.payload;

      return {
        ids: cubes.map(cube => cube.name),
        loading: false,
        query: state.query
      };
    }

    default: {
      return state;
    }
  }
}

export function getStatus(state$: Observable<State>) {
  return state$.select(state => state.loading);
}

export function getCubeIds(state$: Observable<State>) {
  return state$.select(state => state.ids);
}

export function getQuery(state$: Observable<State>) {
  return state$.select(state => state.query);
}

export function getLoading(state$: Observable<State>) {
  return state$.select(state => state.loading);
}
