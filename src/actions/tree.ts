import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {Cube} from "../models/cube";
import {ExpressionTree} from "../models/expressionTree";


/**
 * Instead of passing around action string constants and manually recreating
 * action objects at the point of dispatch, we create services encapsulating
 * each appropriate action group. Action types are included as static
 * members and kept next to their action creator. This promotes a
 * uniform interface and single import for appropriate actions
 * within your application components.
 */
@Injectable()
export class TreeActions {
  static REPLACE = '[Tree] replace';
  replace(tree: ExpressionTree): Action {
    return {
      type: TreeActions.REPLACE,
      payload: tree
    };
  }


}
