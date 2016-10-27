import { Action } from '@ngrx/store';
import { type } from '../util';

import {AnalysisCall} from "../models/analysis/analysisCall";



/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  EXECUTE_COMPLETE:           type('[Execution] Complete'),
  EXECUTE:           type('[Execution] Execute')

};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ExecuteAction implements Action {
  type = ActionTypes.EXECUTE;

  constructor(public payload: AnalysisCall) {
  }
}

export class ExecuteCompleteAction implements Action {
  type = ActionTypes.EXECUTE_COMPLETE;

  constructor(public execution: AnalysisCall) { }
}


/**
 * Exxport a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = ExecuteAction|ExecuteCompleteAction
  ;
