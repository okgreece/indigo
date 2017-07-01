import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ActionReducer} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import {compose} from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import {storeFreeze} from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import {combineReducers} from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromLayout from './layout';
import * as fromCubeSearch from './cube/search';
import * as fromCubes from './cube/cubes';
import * as fromCubesCollection from './cube/collection';
import * as fromExecutions from './execution/execution';
import {Cube} from '../models/cube';
import {environment} from '../../environments/environment';


/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {

  layout: fromLayout.State;
  router: fromRouter.RouterState;
  cubeSearch: fromCubeSearch.State;
  cubes: fromCubes.State;
  cubeCollection: fromCubesCollection.State;
  executions: fromExecutions.State;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  layout: fromLayout.reducer,
  router: fromRouter.routerReducer,
  cubeSearch: fromCubeSearch.reducer,
  cubes: fromCubes.reducer,
  cubeCollection: fromCubesCollection.reducer,
  executions: fromExecutions.reducer
};

const developmentReducer = compose(storeFreeze, combineReducers)(reducers);
const productionReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  }else {
    return developmentReducer(state, action);
  }
}


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `let` operator. They take an input observable
 * and return a new observable. Here's how you would use this selector:
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.let(getBooksState);
 * 	}
 * }
 * ```
 *
 * Note that this is equivalent to:
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = getBooksState(state$);
 * 	}
 * }
 * ```
 *
 */


/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * Once again our compose function comes in handy. From right to left, we
 * first select the books state then we pass the state to the book
 * reducer's getBooks selector, finally returning an observable
 * of search results.
 *
 * Share memoizes the selector functions and published the result. This means
 * every time you call the selector, you will get back the same result
 * observable. Each subscription to the resultant observable
 * is shared across all subscribers.
 */



/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */



/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */




export function getExecutionState(state$: Observable<State>) {
  return state$.select(s => {
    return s.executions;
  });
}


export const getExecutionLoading = compose(fromExecutions.getLoading, getExecutionState);


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `cubes` state.
 *
 * Selectors are used with the `let` operator. They take an input observable
 * and return a new observable. Here's how you would use this selector:
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.cubesState$ = state$.let(getCubesState);
 * 	}
 * }
 * ```
 *
 * Note that this is equivalent to:
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.cubesState$ = getCubesState(state$);
 * 	}
 * }
 * ```
 *
 */
export function getCubesState(state$: Observable<State>) {
  return state$.select(state => state.cubes);
}

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * Once again our compose function comes in handy. From right to left, we
 * first select the cubes state then we pass the state to the cube
 * reducer's getCubes selector, finally returning an observable
 * of search results.
 *
 * Share memoizes the selector functions and published the result. This means
 * every time you call the selector, you will get back the same result
 * observable. Each subscription to the resultant observable
 * is shared across all subscribers.
 */
export const getCubeEntities = compose(fromCubes.getCubeEntities, getCubesState);
export const getCubeIds = compose(fromCubes.getCubeIds, getCubesState);
export const getSelectedCube = compose(fromCubes.getSelectedCube, getCubesState);


/**
 * Just like with the cubes selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export function getCubeSearchState(state$: Observable<State>) {
  return state$.select(s => s.cubeSearch);
}

export const getSearchCubeIds = compose(fromCubeSearch.getCubeIds, getCubeSearchState);
export const getCubeSearchStatus = compose(fromCubeSearch.getStatus, getCubeSearchState);
export const getCubeSearchQuery = compose(fromCubeSearch.getQuery, getCubeSearchState);
export const getCubeSearchSize = compose(fromCubeSearch.getSize, getCubeSearchState);
export const getCubeSearchFrom = compose(fromCubeSearch.getFrom, getCubeSearchState);
export const getCubeSearchLoading = compose(fromCubeSearch.getLoading, getCubeSearchState);


/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of cubes in the store.
 */
export const getCubeSearchResults = function (state$: Observable<State>) {

  return combineLatest<{ [name: string]: Cube }, string[]>(
    state$.let(getCubeEntities),
    state$.let(getCubeIds)
  )
    .map(([entities, ids]) => ids.map(name => {
      return entities[name];
    }));
};


export function getCubeCollectionState(state$: Observable<State>) {
  return state$.select(s => s.cubeCollection);
}

export const getCubeCollectionLoaded = compose(fromCubesCollection.getLoaded, getCubeCollectionState);
export const getCubeCollectionLoading = compose(fromCubesCollection.getLoading, getCubeCollectionState);
export const getCollectionCubeIds = compose(fromCubesCollection.getCubeIds, getCubeCollectionState);

export const getCubeCollection = function (state$: Observable<State>) {
  return combineLatest<{ [name: string]: Cube }, string[]>(
    state$.let(getCubeEntities),
    state$.let(getCollectionCubeIds)
  )
    .map(([entities, ids]) => ids.map(name => entities[name]));
};

export const isSelectedCubeInCollection = function (state$: Observable<State>) {
  return combineLatest<string[], Cube>(
    state$.let(getCollectionCubeIds),
    state$.let(getSelectedCube)
  )
    .map(([ids, selectedCube]) => ids.indexOf(selectedCube.name) > -1);
};




/**
 * Layout Reducers
 */
export const getLayoutState = (state$: Observable<State>) =>
  state$.select(state => state.layout);

export const getShowSidenav = compose(fromLayout.getShowSidenav, getLayoutState);






