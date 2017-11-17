import 'rxjs/add/operator/let';
import {Component, ChangeDetectionStrategy, NgModule} from '@angular/core';

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import {Http} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';


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

  loading = true;

  constructor(private router: Router, private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
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
