import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CubeActions } from '../../actions/cube';
import { Cube } from '../../models/cube';


export interface CollectionState {
  loaded: boolean;
  loading: boolean;
  ids: string[];
};

const initialState: CollectionState = {
  loaded: false,
  loading: false,
  ids: []
};

export default function(state = initialState, action: Action): CollectionState {
  switch (action.type) {
    case CubeActions.LOAD_COLLECTION: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case CubeActions.LOAD_COLLECTION_SUCCESS: {
      const cubes: Cube[] = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: cubes.map(cube => cube.id)
      };
    }

    case CubeActions.ADD_TO_COLLECTION_SUCCESS:
    case CubeActions.REMOVE_FROM_COLLECTION_FAIL: {
      const cube: Cube = action.payload;

      if (state.ids.includes(cube.id)) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [ ...state.ids, cube.id ]
      });
    }

    case CubeActions.REMOVE_FROM_COLLECTION_SUCCESS:
    case CubeActions.ADD_TO_COLLECTION_FAIL: {
      const cube: Cube = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== cube.id)
      });
    }

    default: {
      return state;
    }
  }
}


export function getLoaded() {
  return (state$: Observable<CollectionState>) => state$
    .select(s => s.loaded);
}

export function getLoading() {
  return (state$: Observable<CollectionState>) => state$
    .select(s => s.loading);
}

export function getCubeIds() {
  return (state$: Observable<CollectionState>) => state$
    .select(s => s.ids);
}

export function isCubeInCollection(id: string) {
  return (state$: Observable<CollectionState>) => state$
    .let(getCubeIds())
    .map(ids => ids.includes(id));
}
