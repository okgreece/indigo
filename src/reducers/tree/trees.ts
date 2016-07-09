import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { TreeActions } from '../../actions';
import {ExpressionTree} from "../../models/expressionTree";


export interface TreesState {
  tree: ExpressionTree;
}

const initialState: TreesState = {
  tree:null
};

export default function(state = initialState, action: Action): TreesState {
  switch (action.type) {
    case TreeActions.REPLACE:
    {
      const tree: ExpressionTree = action.payload;

      return {
        tree: Object.assign({}, state.tree, tree)
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



export function getTree() {
  return (state$: Observable<TreesState>) => state$
    .select(s => s.tree);
}

