import 'rxjs/add/operator/let';
import {Component, ChangeDetectionStrategy} from '@angular/core';

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import {Http} from '@angular/http';
import {HttpInterceptorService} from "ng-http-interceptor";



@Component({
  selector: 'indigo-app',
  styles: [`    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-overlay" *ngIf="loading">
      <!-- show something fancy here, here with Angular 2 Material's loading bar or circle -->
      <md-progress-bar mode="indeterminate"></md-progress-bar>
    </div>
      <router-outlet></router-outlet>




    
  `
})
export class AppComponent {



  loading: boolean = true;


  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });




  }
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
