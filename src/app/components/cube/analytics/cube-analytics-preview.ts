import {Component, Input} from '@angular/core';
import {Cube} from '../../../models/cube';


@Component({
  selector: 'indigo-cube-analytics-preview',
  template: `<md-card>
  <md-card-title-group>
    <md-card-title>{{ algorithm.title }}</md-card-title>
  </md-card-title-group>
  <div class="row text-center">
    <button [routerLink]="'/cube/analytics/' + cubeId+ '/'+algorithm.name" color="primary" md-raised-button>Run
    </button>
  </div>

</md-card>

  `,
  styles: [`
    md-card {
      width: 400px;
      height: 300px;
      margin: 15px;
    }
    md-card-title {
      margin-right: 10px;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    md-card-footer {
      padding: 0 25px 25px;
    }
  `]
})
export class CubeAnalyticsPreviewComponent {
  @Input() algorithm: Algorithm;
  @Input() cube: Cube;


  get cubeId(){
    //debugger;
    return this.cube.name;
  }

  get id() {
    return this.algorithm.name;
  }

  get title() {
    return this.algorithm.name;
  }

}
