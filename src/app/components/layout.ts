import {Component, ViewContainerRef, ChangeDetectorRef} from '@angular/core';
import * as fromRoot from '../reducers';
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import * as layout from '../actions/layout';
import {Observable} from "rxjs";


@Component({
  selector: 'bc-layout',
  template: `<md-sidenav-container fullscreen>
   
  <bc-sidenav [open]="showSidenav$ | async">

    <bc-nav-item (activate)="closeSidenav()" routerLink="/cube/find" icon="search">
      Browse Datasets
    </bc-nav-item>
    <button md-button #mybutton (click)="closeSidenav()">Close menu</button>

  </bc-sidenav>
  <bc-toolbar class="indigo" (openMenu)="openSidenav()">
    <span class="indigo">indigo</span>

  </bc-toolbar>
  <router-outlet></router-outlet>

</md-sidenav-container>
  `,
  styles: [`

    
    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .secondary {
      color: rgba(0, 0, 0, .54);
    }

    md-sidenav-layout {
      color:white;
     // right: 30% !important; // Make space for the devtools, demo only
    }

    md-sidenav {
      width: 300px;
      color:white;
    }
    
   .indigo{
      font-family: 'Leckerli One', cursive;
      color:#29367f;
    }
    
   .md-button-wrapper{
      color: #29367f;
    }
  `]
})
export class LayoutComponent {

  constructor(private store: Store<fromRoot.State>, viewContainerRef: ViewContainerRef, private route: ActivatedRoute, private ref: ChangeDetectorRef) {
    this.showSidenav$ = this.store.let(fromRoot.getShowSidenav);

  }

  showSidenav$: Observable<boolean>;


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
