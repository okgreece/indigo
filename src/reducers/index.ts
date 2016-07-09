import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeLogger is a powerful metareducer that logs out each time we dispatch
 * an action.
 *
 * A metareducer wraps a reducer function and returns a new reducer function
 * with superpowers. They are handy for all sorts of tasks, including
 * logging, undo/redo, and more.
 */
import { storeLogger } from 'ngrx-store-logger';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

/**
 * @ngrx/router-store keeps the router in sync with @ngrx/store. To connect the
 * two, we need to use the routerReducer.
 */
import { routerReducer, RouterState } from '@ngrx/router-store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import searchReducer, * as fromSearch from './search';
import cubes_searchReducer, * as fromCubesSearch from './cube/search';
import booksReducer, * as fromBooks from './books';
import cubesReducer, * as fromCubes from './cube/cubes';
import collectionReducer, * as fromCollection from './collection';
import cubes_collectionReducer, * as fromCubesCollection from './cube/collection';
import tree_Reducer, * as fromTree from "./tree/trees";

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  router: RouterState;
  search: fromSearch.SearchState;
  cubes_search: fromCubesSearch.SearchState;
  books: fromBooks.BooksState;
  cubes: fromCubes.CubesState;
  collection: fromCollection.CollectionState;
  cube_collection: fromCubesCollection.CollectionState;
  tree: fromTree.TreesState
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export default compose(storeLogger(), combineReducers)({
  router: routerReducer,
  search: searchReducer,
  cubes_search: cubes_searchReducer,
  books: booksReducer,
  cubes: cubesReducer,
  collection: collectionReducer,
  cube_collection: cubes_collectionReducer,
  tree: tree_Reducer
});


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
 * 	constructor(state$: Observable<AppState>) {
 * 	  this.booksState$ = state$.let(getBooksState());
 * 	}
 * }
 * ```
 */
 export function getBooksState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.books);
}

export function getCubesState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.cubes);
}

export function getTreesState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.tree);
}

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * Once again our compose function comes in handy. From right to left, we
 * first select the books state then we pass the state to the book
 * reducer's getBooks selector, finally returning an observable
 * of search results.
 */
 export function getBookEntities() {
   return compose(fromBooks.getBookEntities(), getBooksState());
 }

 export function getBook(id: string) {
   return compose(fromBooks.getBook(id), getBooksState());
 }

 export function hasBook(id: string) {
   return compose(fromBooks.hasBook(id), getBooksState());
 }

 export function getBooks(bookIds: string[]) {
   return compose(fromBooks.getBooks(bookIds), getBooksState());
 }




export function getCubeEntities() {
  return compose(fromCubes.getCubeEntities(), getCubesState());
}

export function getCube(id: string) {
  return compose(fromCubes.getCube(id), getCubesState());
}

export function hasCube(id: string) {
  return compose(fromCubes.hasCube(id), getCubesState());
}

export function getCubes(cubeIds: string[]) {
  return compose(fromCubes.getCubes(cubeIds), getCubesState());
}


/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export function getSearchState() {
 return (state$: Observable<AppState>) => state$
   .select(s => s.search);
}
export function getCubesSearchState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.cubes_search);
}
export function getSearchBookIds() {
  return compose(fromSearch.getBookIds(), getSearchState());
}

export function getSearchCubeIds() {
  return compose(fromCubesSearch.getCubeIds(), getCubesSearchState());
}

export function getSearchStatus() {
  return compose(fromSearch.getStatus(), getSearchState());
}
export function getCubesSearchStatus() {
  return compose(fromCubesSearch.getStatus(), getCubesSearchState());
}
export function getSearchQuery() {
  return compose(fromSearch.getQuery(), getSearchState());
}
export function getCubesSearchQuery() {
  return compose(fromCubesSearch.getQuery(), getCubesSearchState());
}

/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */
export function getSearchResults() {
  return (state$: Observable<AppState>) => state$
    .let(getSearchBookIds())
    .switchMap(bookIds => state$.let(getBooks(bookIds)));
}

export function getCubesSearchResults() {
  return (state$: Observable<AppState>) => state$
    .let(getSearchCubeIds())
    .switchMap(cubeIds => state$.let(getCubes(cubeIds)));
}


export function getCollectionState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.collection);
}
export function getCubesCollectionState() {
  return (state$: Observable<AppState>) => state$
    .select(s =>{return s.cube_collection});
}
export function getCollectionLoaded() {
  return compose(fromCollection.getLoaded(), getCollectionState());
}
export function getCubesCollectionLoaded() {

  return compose(fromCubesCollection.getLoaded(), getCubesCollectionState());
}

export function getCollectionLoading() {
  return compose(fromCollection.getLoading(), getCollectionState());
}
export function getCubesCollectionLoading() {
  return compose(fromCubesCollection.getLoading(), getCubesCollectionState());
}
export function getCollectionBookIds() {
  return compose(fromCollection.getBookIds(), getCollectionState());
}

export function getCollectionCubeIds() {
  return compose(fromCubesCollection.getCubeIds(), getCollectionState());
}

export function isBookInCollection(id: string) {
  return compose(fromCollection.isBookInCollection(id), getCollectionState());
}
export function isCubeInCollection(id: string) {
  return compose(fromCubesCollection.isCubeInCollection(id), getCubesCollectionState());
}
export function getBookCollection() {
  return (state$: Observable<AppState>) => state$
    .let(getCollectionBookIds())
    .switchMap(bookIds => state$.let(getBooks(bookIds)));
}
export function getCubeCollection() {
  return (state$: Observable<AppState>) => state$
    .let(getCollectionCubeIds())
    .switchMap(cubeIds => state$.let(getCubes(cubeIds)));
}


export function getTree() {
  return compose(fromTree.getTree(), getTreesState());
}
