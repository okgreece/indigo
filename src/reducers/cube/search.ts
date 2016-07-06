import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { Cube } from '../../models/cube';
import { CubeActions } from '../../actions/cube';


export interface SearchState {
  ids: string[];
  loading: boolean;
  query: string;
}

const initialState: SearchState = {
  ids: [],
  loading: false,
  query: ''
};

export default function(state = initialState, action: Action): SearchState {
  switch (action.type) {
    case CubeActions.SEARCH: {
      const query = action.payload;

      return Object.assign(state, {
        query,
        loading: true
      });
    }

    case CubeActions.SEARCH_COMPLETE: {
      const cubes: Cube[] = action.payload;
      debugger;
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

export function getStatus() {
  return (state$: Observable<SearchState>) => state$
    .select(s => s.loading);
}

export function getCubeIds() {
  return (state$: Observable<SearchState>) => state$
    .select(s => s.ids);
}

export function getQuery() {
  return (state$: Observable<SearchState>) => state$
    .select(s => s.query);
}
