import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {Cube} from "../models/cube";
import { type } from '../util';


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




export class CubeActions {
  static SEARCH = '[Cube] Search';
  search(query: string): Action {
    return {
      type: CubeActions.SEARCH,
      payload: query
    };
  }

  static SEARCH_COMPLETE = '[Cube] Search Complete';
  searchComplete(results: Cube[], search: string): Action {
    return {
      type: CubeActions.SEARCH_COMPLETE,
      payload: results.filter(function (cube) {
        if(search=="")return true;
        return cube.name.indexOf(search)>-1;
      })
    };
  }

  static ADD_TO_COLLECTION = '[Cube] Add to Collection';
  addToCollection(cube: Cube): Action {
    return {
      type: CubeActions.ADD_TO_COLLECTION,
      payload: cube
    };
  }

  static ADD_TO_COLLECTION_SUCCESS = '[Cube] Add to Collection Success';
  addToCollectionSuccess(cube: Cube): Action {
    return {
      type: CubeActions.ADD_TO_COLLECTION_SUCCESS,
      payload: cube
    };
  }

  static ADD_TO_COLLECTION_FAIL = '[Cube] Add to Collection Fail';
  addToCollectionFail(cube: Cube): Action {
    return {
      type: CubeActions.ADD_TO_COLLECTION_FAIL,
      payload: cube
    };
  }

  static REMOVE_FROM_COLLECTION = '[Cube] Remove from Collection';
  removeFromCollection(cube: Cube): Action {
    return {
      type: CubeActions.REMOVE_FROM_COLLECTION,
      payload: cube
    };
  }

  static REMOVE_FROM_COLLECTION_SUCCESS = '[Cube] Remove From Collection Success';
  removeFromCollectionSuccess(cube: Cube): Action {
    return {
      type: CubeActions.REMOVE_FROM_COLLECTION_SUCCESS,
      payload: cube
    };
  }

  static REMOVE_FROM_COLLECTION_FAIL = '[Cube] Remove From Collection Fail';
  removeFromCollectionFail(cube: Cube): Action {
    return {
      type: CubeActions.REMOVE_FROM_COLLECTION_FAIL,
      payload: cube
    };
  }

  static LOAD_COLLECTION = '[Cube] Load Collection';
  loadCollection(): Action {
    return {
      type: CubeActions.LOAD_COLLECTION
    };
  }

  static LOAD_COLLECTION_SUCCESS = '[Cube] Load Collection Success';
  loadCollectionSuccess(cubes: Cube[]): Action {
    return {
      type: CubeActions.LOAD_COLLECTION_SUCCESS,
      payload: cubes
    };
  }

  static LOAD_CUBE = '[Cube] Load Cube';
  loadCube(cube: Cube): Action {
    return {
      type: CubeActions.LOAD_CUBE,
      payload: cube
    };
  }
  static LOAD_CUBE_SUCCESS = '[Cube] Load Cube';
  loadCubeComplete(cube:Cube) :Action{
    return {
      type: CubeActions.LOAD_CUBE_SUCCESS,
      payload:cube
    };
  }
}
