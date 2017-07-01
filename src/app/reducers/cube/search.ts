import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import * as cube from '../../actions/cube/cube2';


export interface State {
  ids: string[];
  loading: boolean;
  query: string;
  size: number;
  from: number;
}

const initialState: State = {
  ids: [],
  loading: false,
  query: '',
  size: 50,
  from: 0
};

export function reducer(state = initialState, action: cube.Actions): State {
  switch (action.type) {
    case cube.ActionTypes.SEARCH_CUBE: {
      const query = action.payload.query;
      const size = action.payload.size;
      const from = action.payload.from;

     /* if (query === '') {
        return {
          ids: [],
          loading: false,
          query
        };
      }*/

      return Object.assign({}, state, {
        query, size, from,
        loading: true
      });
    }

    case cube.ActionTypes.SEARCH_CUBE_COMPLETE: {
      const cubes = action.payload.cubes;
      return {
        ids: cubes.map(cube => cube.id),
        loading: false,
        query: state.query,
        size: state.size,
        from: state.from
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
export function getSize(state$: Observable<State>) {
  return state$.select(state => state.size);
}
export function getFrom(state$: Observable<State>) {
  return state$.select(state => state.from);
}

export function getLoading(state$: Observable<State>) {
  return state$.select(state => {
    return state.loading;
  });
}
