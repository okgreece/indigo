import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../reducers';
import * as cube from '../../actions/cube/cube2';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Cube Page's responsibility is to map router params
 * to a 'Select' cube action. Actually showing the selected
 * cube remains a responsibility of the
 * SelectedCubePageComponent
 */
@Component({
  selector: 'bc-view-cube-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-cube-page></bc-selected-cube-page>
  `
})
export class ViewCubePageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .select<string>('id')
      .map(id => new cube.SelectAction(id))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
