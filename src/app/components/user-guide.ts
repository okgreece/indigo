import {ChangeDetectionStrategy, Component} from '@angular/core';
/**
 * Created by larjo on 30/4/2017.
 */



@Component({
  selector: 'user-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxLayout="row" fxLayoutAlign="center center">

    <div fxFlex="70%" class="content-card">
      <md-card>

        <md-card-content>
          <div Markdown path="USERGUIDE.md"></div>

        </md-card-content>
      </md-card>
    </div>
    </div>
   

  `,
  styles: [`
  


  `]
})
export class UserGuidePageComponent {

}
