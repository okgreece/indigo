import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';
import {Component, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef} from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers';
import * as layout from '../actions/layout';
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'indigo-app',
  styles: [`    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

      <router-outlet></router-outlet>




    
  `
})
export class AppComponent {

  private viewContainerRef: ViewContainerRef;

  constructor(private store: Store<fromRoot.State>, viewContainerRef: ViewContainerRef, private route: ActivatedRoute,       private ref: ChangeDetectorRef) {
    /**
     * Selectors can be applied with the `let` operator which passes the source
     * observable to the provided function.
     *
     * More on `let`: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35#let
     * More on selectors: https://gist.github.com/btroncone/a6e4347326749f938510#extracting-selectors-for-reuse
     */
    this.viewContainerRef = viewContainerRef;



   /* let obs =  Observable.of({
     chromeless: true

    }).delay(3000);

    debugger
    obs.subscribe(function (val) {
      debugger;
        that.chromeless =val.chromeless;

    });
*/

  }


}
