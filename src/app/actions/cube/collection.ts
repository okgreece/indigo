import { Action } from '@ngrx/store';
import { Cube } from '../../models/cube';
import { type } from '../../util';


export const ActionTypes = {
  ADD_CUBE:             type('[Collection] Add Cube'),
  ADD_CUBE_SUCCESS:     type('[Collection] Add Cube Success'),
  ADD_CUBE_FAIL:        type('[Collection] Add Cube Fail'),
  REMOVE_CUBE:          type('[Collection] Remove Cube'),
  REMOVE_CUBE_SUCCESS:  type('[Collection] Remove Cube Success'),
  REMOVE_CUBE_FAIL:     type('[Collection] Remove Cube Fail'),
  LOAD:                 type('[Collection] Load Cube'),
  LOAD_SUCCESS:         type('[Collection] Load Cube Success'),
  LOAD_FAIL:            type('[Collection] Load Cube Fail'),
};


/**
 * Add Cube to Collection Actions
 */
export class AddCubeAction implements Action {
  type = ActionTypes.ADD_CUBE;

  constructor(public payload: Cube) { }
}

export class AddCubeSuccessAction implements Action {
  type = ActionTypes.ADD_CUBE_SUCCESS;

  constructor(public payload: Cube) { }
}

export class AddCubeFailAction implements Action {
  type = ActionTypes.ADD_CUBE_FAIL;

  constructor(public payload: Cube) { }
}


/**
 * Removje Cube from Collection Actions
 */
export class RemoveCubeAction implements Action {
  type = ActionTypes.REMOVE_CUBE;

  constructor(public payload: Cube) { }
}

export class RemoveCubeSuccessAction implements Action {
  type = ActionTypes.REMOVE_CUBE_SUCCESS;

  constructor(public payload: Cube) { }
}

export class RemoveCubeFailAction implements Action {
  type = ActionTypes.REMOVE_CUBE_FAIL;

  constructor(public payload: Cube) { }
}

/**
 * Load Collection Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor() { }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Cube[]) { }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any) { }
}


export type Actions
  = AddCubeAction
  | AddCubeSuccessAction
  | AddCubeFailAction
  | RemoveCubeAction
  | RemoveCubeSuccessAction
  | RemoveCubeFailAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
