import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';
import {Component, ChangeDetectionStrategy, ViewContainerRef} from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers';
import * as layout from '../actions/layout';


@Component({
  selector: 'book-collection-app',
  styles:[`    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .secondary {
      color: rgba(0, 0, 0, .54);
    }

    md-sidenav-layout {
      background: rgba(0, 0, 0, .03);
      color:white;
     // right: 30% !important; // Make space for the devtools, demo only
    }

    md-sidenav {
      width: 300px;
      color:white;
    }
    
   .indigo{
      font-family: 'Leckerli One', cursive;
      color:white;
    }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async">
<!--        <bc-nav-item (activate)="closeSidenav()" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (activate)="closeSidenav()" routerLink="/book/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>     -->   
        
        <bc-nav-item (activate)="closeSidenav()" routerLink="/cubes" icon="collections_bookmark" hint="View your bookmarked datasets">
          My Collection
        </bc-nav-item>
        <bc-nav-item (activate)="closeSidenav()" routerLink="/cube/find" icon="search" hint="Find a dataset!">
          Browse Datasets
        </bc-nav-item>
       <button md-button #mybutton (click)="closeSidenav()">Close</button>

      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()">
        <span class="indigo">indigo</span>

      </bc-toolbar>

      <router-outlet></router-outlet>
    </bc-layout>
  `
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  private viewContainerRef: ViewContainerRef;

  constructor(private store: Store<fromRoot.State>, viewContainerRef:ViewContainerRef) {
    /**
     * Selectors can be applied with the `let` operator which passes the source
     * observable to the provided function.
     *
     * More on `let`: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35#let
     * More on selectors: https://gist.github.com/btroncone/a6e4347326749f938510#extracting-selectors-for-reuse
     */
    this.showSidenav$ = this.store.let(fromRoot.getShowSidenav);
    this.viewContainerRef = viewContainerRef;

  }

  closeSidenav() {
    /**
     * All state updates are handled through dispatched actions in 'container'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our
     * application.
     */
    this.store.dispatch(new layout.CloseSidenavAction());
  }

  openSidenav() {
    this.store.dispatch(new layout.OpenSidenavAction());
  }
}
