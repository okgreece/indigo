import { Action } from '@ngrx/store';
import { Cube } from '../../models/cube';
import { type } from '../../util';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  SEARCH:           type('[Cube] Search'),
  SEARCH_COMPLETE:  type('[Cube] Search Complete'),
  LOAD:             type('[Cube] Load'),
  SELECT:           type('[Cube] Select'),
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handcube/advanced-types.html#discriminated-unions
 */
export class SearchAction implements Action {
  type = ActionTypes.SEARCH;

  constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
  type = ActionTypes.SEARCH_COMPLETE;

  constructor(public payload: Cube[]) {

  }

}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: Cube) { }
}

export class SelectAction implements Action {
  type = ActionTypes.SELECT;

  constructor(public payload: string) { }
}

/**
 * Exxport a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SearchAction
  | SearchCompleteAction
  | LoadAction
  | SelectAction;
