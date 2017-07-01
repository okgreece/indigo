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
  LOAD_CUBE:                 type('[Collection] Load Cube'),
  LOAD_CUBE_SUCCESS:         type('[Collection] Load Cube Success'),
  LOAD_CUBE_FAIL:            type('[Collection] Load Cube Fail'),
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
export class LoadCubeAction implements Action {
  type = ActionTypes.LOAD_CUBE;

  constructor() { }
}

export class LoadCubeSuccessAction implements Action {
  type = ActionTypes.LOAD_CUBE_SUCCESS;
  payload = {'cubes': []};
  constructor(payload: any) {
    this.payload = payload;
  }
}

export class LoadCubeFailAction implements Action {
  type = ActionTypes.LOAD_CUBE_FAIL;

  constructor(public payload: any) { }
}


export type Actions
  = AddCubeAction
  | AddCubeSuccessAction
  | AddCubeFailAction
  | RemoveCubeAction
  | RemoveCubeSuccessAction
  | RemoveCubeFailAction
  | LoadCubeAction
  | LoadCubeSuccessAction
  | LoadCubeFailAction;
