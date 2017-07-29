import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, ROUTES} from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {MaterialModule, MdCardModule} from '@angular/material';

import { ComponentsModule } from './components';

import { AppComponent } from './containers/app';
import { NotFoundPageComponent } from './containers/not-found-page';
import { routes } from './routes';
import { reducer } from './reducers';
import { schema } from './db';
import {ApiCubesService} from './services/api-cubes';
import {CollectionCubePageComponent} from './containers/cube/collection-page';
import {ViewCubePageComponent} from './containers/cube/view-cube-page';
import {FindCubePageComponent} from './containers/cube/find-cube-page';
import {SelectedCubePageComponent} from './containers/cube/selected-cube-page';
import {CubeExistsGuard} from './guards/cube-exists';
import {CubeEffects} from './effects/cube';
import {AlgorithmsService} from './services/algorithms';
import {CubeAnalyticsPage} from './containers/cube/cube-analytics';
import {AnalysisService} from './services/analysis';
import {environment} from '../environments/environment';
import {APP_BASE_HREF} from '@angular/common';
import {CubeAnalyticsEmbedPage} from './containers/cube/cube-analytics-embed-page';
import {CubeExistsLightGuard} from './guards/cube-exists-light';
import {AggregatePreviewDialogComponent, FactsPreviewDialogComponent} from './components/cube/analytics/cube-analytics-detail';
import {FlexLayoutModule} from '@angular/flex-layout';
import 'hammerjs';
import {MarkdownModule} from 'angular2-markdown';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CubeCollectionEffects} from "./effects/cubesCollection";


@NgModule({
  imports: [


    CommonModule,
    BrowserModule,
/*
    MaterialModule,
*/
    BrowserAnimationsModule,
    FlexLayoutModule,
    ComponentsModule,
    RouterModule.forRoot(routes, { useHash: false }),
    MarkdownModule.forRoot(),
MdCardModule,
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
    EffectsModule.run(CubeCollectionEffects),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
    DBModule.provideDB(schema),
  ],
  declarations: [
    AppComponent,
    FindCubePageComponent,
    SelectedCubePageComponent,
    ViewCubePageComponent,
    CubeAnalyticsPage,
    CollectionCubePageComponent,
    NotFoundPageComponent,
    CubeAnalyticsEmbedPage,

  ],
  providers: [
    CubeExistsGuard,
    CubeExistsLightGuard,
    ApiCubesService,
    AlgorithmsService,
    AnalysisService,
    {provide: APP_BASE_HREF, useValue: environment.baseHref},
  ],
  bootstrap: [
    AppComponent
  ],
/*
  entryComponents: [FactsPreviewDialogComponent, AggregatePreviewDialogComponent],
*/

})
export class AppModule {
  public environment = environment;
}
