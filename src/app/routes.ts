import {Routes} from '@angular/router';

import {CubeExistsGuard} from './guards/cube-exists';
import {FindCubePageComponent} from './containers/cube/find-cube-page';
import {ViewCubePageComponent} from './containers/cube/view-cube-page';
import {NotFoundPageComponent} from './containers/not-found-page';
import {CubeAnalyticsPage} from './containers/cube/cube-analytics';
import {CubeAnalyticsIndexComponent} from './containers/cube/cube-analytics-index-page';
import {CubeAnalyticsEmbedPage} from './containers/cube/cube-analytics-embed-page';
import {LayoutComponent} from './components/layout';
import {CubeExistsLightGuard} from './guards/cube-exists-light';
import {UserGuidePageComponent} from './components/user-guide';

export const routes: Routes = [

    {
      path: 'cube/analytics/:id/:algorithm/:configuration/embed/:part',
      canActivate: [CubeExistsLightGuard],
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
          path: 'userguide',
          component: UserGuidePageComponent
        },

        {
          path: 'cube/analytics/:id/:algorithm/:configuration',
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
