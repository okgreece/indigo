import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import {ActionTypes} from '../../actions/execution'
import {AnalysisCall} from "../../models/analysis/analysisCall";
import * as execution from '../../actions/execution';


export interface State {
  loading: boolean;
  execution: AnalysisCall;
}

const initialState: State = {
  loading:false,
  execution: null

};

export  function reducer(state = initialState, action: execution.Actions|any): State {
  switch (action.type) {
    case ActionTypes.EXECUTE:
    {
      const execution: AnalysisCall = action.execution;

      return {
        execution: null, loading: true
      };
    }
    case ActionTypes.EXECUTE_COMPLETE :
    {

      return {
        execution: null, loading: false
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



export function getExecution(state$: Observable<State>) {
  return state$
    .select(s => s.execution);
}


export function getLoading(state$: Observable<State>) {
  return state$.select(state => {

    return state.loading;
  });
}
