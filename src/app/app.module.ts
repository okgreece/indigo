import {NgModule, ViewContainerRef,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MaterialModule } from '@angular/material';

import { ComponentsModule } from './components';
import { BookEffects } from './effects/book';
import { CollectionEffects } from './effects/collection';
import { BookExistsGuard } from './guards/book-exists';

import { AppComponent } from './containers/app';
import { FindBookPageComponent } from './containers/find-book-page';
import { ViewBookPageComponent } from './containers/view-book-page';
import { SelectedBookPageComponent } from './containers/selected-book-page';
import { CollectionPageComponent } from './containers/collection-page';
import { NotFoundPageComponent } from './containers/not-found-page';
import { GoogleBooksService } from './services/google-books';
import { routes } from './routes';
import { reducer } from './reducers';
import { schema } from './db';
import {ApiCubesService} from "./services/api-cubes";
import {CollectionCubePageComponent} from "./containers/cube/collection-page";
import {ViewCubePageComponent} from "./containers/cube/view-cube-page";
import {FindCubePageComponent} from "./containers/cube/find-cube-page";
import {SelectedCubePageComponent} from "./containers/cube/selected-cube-page";
import {CubeExistsGuard} from "./guards/cube-exists";
import {CubeEffects} from "./effects/cube";
import {TreeExecution} from "./services/tree-execution";
import {AlgorithmsService} from "./services/algorithms";
import {CubeAnalyticsPage} from "./containers/cube/cube-analytics";
import {AnalysisService} from "./services/analysis";
import {environment} from "../environments/environment";
import {APP_BASE_HREF} from '@angular/common';
import {CubeAnalyticsEmbedPage} from "./containers/cube/cube-analytics-embed-page";



@NgModule({
  imports: [

    CommonModule,
    BrowserModule,
    MaterialModule.forRoot(),
    ComponentsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store and uses
     * the store as the single source of truth for the router's state.
     */
    RouterStoreModule.connectRouter(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    /**
     * EffectsModule.run() sets up the effects class to be initialized
     * immediately when the application starts.
     *
     * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
     */
    EffectsModule.run(CubeEffects),
    EffectsModule.run(BookEffects),
    EffectsModule.run(CollectionEffects),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
    DBModule.provideDB(schema),
  ],
  declarations: [
    AppComponent,
    FindBookPageComponent,
    SelectedBookPageComponent,
    ViewBookPageComponent,
    CollectionPageComponent,
    FindCubePageComponent,
    SelectedCubePageComponent,
    ViewCubePageComponent,
    CubeAnalyticsPage,
    CubeAnalyticsEmbedPage,
    CollectionCubePageComponent,
    NotFoundPageComponent,

  ],
  providers: [
    BookExistsGuard,
    CubeExistsGuard,
    GoogleBooksService,
    ApiCubesService,
    TreeExecution,
    AlgorithmsService,
    AnalysisService,
    {provide: APP_BASE_HREF, useValue: environment.baseHref},
    {
      provide: 'chromeless',
      useValue: () => {
        return true;
      }
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  public environment = environment;
}
