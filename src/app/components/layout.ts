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
      Browse datasets
    </bc-nav-item>


    <bc-nav-item (activate)="closeSidenav()" routerLink="/userguide" icon="note">
      Read the manual
    </bc-nav-item>
    
    
    <button md-button #mybutton (click)="closeSidenav()">Close menu</button>

  </bc-sidenav>
  <bc-toolbar class="indigo" (openMenu)="openSidenav()">
    <span class="indigo">indigo</span>

  </bc-toolbar>
    <div class="site">
      <main class="content">
  <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <p>
          Indigo was developed with support from the OpenBudgets.eu project, funded by the European Union’s H2020 EU research and innovation programme, under grant agreement No 645833.

        </p>
      </footer>
    </div>
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
    
    
    .footer{
      color: gainsboro;
      text-align: center;
      font-size: x-small;
      justify-content: center;
      display: flex;
    }
    
    .footer p{
      max-width: calc(90em * 0.5);
      padding: 10px;
      border-top: 1px solid #4caf50;
    }

    .site{
      display: flex;
      flex-direction: column;
      min-height: 93.5vh;
    }
    .content{
      flex: 1;
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
      color:white;
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
