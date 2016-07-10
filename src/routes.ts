import { Routes } from '@ngrx/router';

import { BookExistsGuard, CubeExistsGuard } from './guards';


const routes: Routes = [
  {
    path: '/',
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/cube/collection').CollectionPage);
      });
    })
  },
  {
    path: '/cubes',
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/cube/collection').CollectionPage);
      });
    })
  },
  {
    path: '/book/find',
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/book-find').BookFindPage);
      });
    })
  },
  {
    path: '/book/:id',
    guards: [ BookExistsGuard ],
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/book-view').BookViewPage);
      });
    })
  },

  {
    path: '/cube/find',
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/cube/cube-find').CubeFindPage);
      });
    })
  },
  {
    path: '/cube/:id',
    guards: [ CubeExistsGuard ],
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/cube/cube-view').CubeViewPage);
      });
    })
  },
  {
    path: '/*',
    loadComponent: () => new Promise(resolve => {
      (require as any).ensure([], require => {
        resolve(require('./pages/not-found').NotFoundPage);
      });
    })
  }
];

export default routes;
