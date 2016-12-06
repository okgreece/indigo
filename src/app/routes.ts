import {Routes} from '@angular/router';

import {BookExistsGuard} from './guards/book-exists';
import {CubeExistsGuard} from './guards/cube-exists';
import {FindBookPageComponent} from './containers/find-book-page';
import {FindCubePageComponent} from './containers/cube/find-cube-page';
import {ViewBookPageComponent} from './containers/view-book-page';
import {ViewCubePageComponent} from './containers/cube/view-cube-page';
import {CollectionPageComponent} from './containers/collection-page';
import {CollectionCubePageComponent} from './containers/cube/collection-page';
import {NotFoundPageComponent} from './containers/not-found-page';
import {CubeAnalyticsDetailComponent} from "./components/cube/analytics/cube-analytics-detail";
import {CubeAnalyticsPage} from "./containers/cube/cube-analytics";
import {CubeAnalyticsIndexComponent} from "./containers/cube/cube-analytics-index-page";
import {CubeAnalyticsEmbedPage} from "./containers/cube/cube-analytics-embed-page";
import {AppComponent} from "./containers/app";
import {LayoutComponent} from "./components/layout";

export const routes: Routes = [

    {
      path: 'cube/analytics/:id/:algorithm/embed/:part',
      canActivate: [CubeExistsGuard],
      component: CubeAnalyticsEmbedPage
    },
    {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: '',
          component: FindCubePageComponent
        },
        {
          path: 'cube/find',
          component: FindCubePageComponent
        },
        {
          path: 'cube/indicators/:id',
          canActivate: [CubeExistsGuard],
          component: ViewCubePageComponent
        },

        {
          path: 'cube/analytics/:id/:algorithm',
          canActivate: [CubeExistsGuard],
          component: CubeAnalyticsPage
        },


        {
          path: 'cube/analytics/:id',
          canActivate: [CubeExistsGuard],
          component: CubeAnalyticsIndexComponent
        },


        {
          path: 'cube/:id',
          canActivate: [CubeExistsGuard],
          component: ViewCubePageComponent
        },

      ]
    },

    {
      path: '**',
      component: NotFoundPageComponent
    }

  ]
  ;
