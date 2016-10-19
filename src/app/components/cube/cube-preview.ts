import {Component, Input} from '@angular/core';
import {Cube} from '../../models/cube';


@Component({
  selector: 'bc-cube-preview',
  template: `
  <md-card>
    <md-card-title-group>
      <md-card-title>{{ cube.name }}</md-card-title>
    </md-card-title-group>
    <div class="row">
      <a [routerLink]=" '/cube/indicators/' + cube.name">Indicators Builder</a>
    </div>
    <div class="row">
      <a [routerLink]=" '/cube/analytics/' + cube.name">Analytics & Data Mining</a>
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
export class CubePreviewComponent {
  @Input() cube: Cube;

  get id() {
    return this.cube.name;
  }

  get title() {
    return this.cube.name;
  }

}
