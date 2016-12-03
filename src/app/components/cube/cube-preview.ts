import {Component, Input} from '@angular/core';
import {Cube} from '../../models/cube';


@Component({
  selector: 'indigo-cube-preview',
  template: `<md-card>
  <md-card-title-group align="center center" >
  
    <md-card-title>{{ cube.pckg.title }}</md-card-title>
         <md-card-subtitle>{{ cube.pckg.author }}</md-card-subtitle>
         <span  md-card-md-image  class="flag-icon flag-icon-{{ cube.pckg.countryCode?.toLowerCase() }}"></span>

  </md-card-title-group>
  <div class="row text-center">
    <button [routerLink]="'/cube/analytics/' + cube.id" color="primary" md-raised-button>Analytics & Data Mining
    </button>
<!--
    <button [routerLink]="'/cube/indicators/' + cube.id" md-raised-button>Indicators Builder</button>
-->
  </div>

</md-card>

  `,
  styles: [`
  md-card-title{
    font-size:20px;
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

    span {
      display: inline-block;
      font-size: 13px;
    }
    
         md-card {
      margin: 0 16px 16px 0;
      width: 350px;
    }
    
    .flag-icon{
        width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 64px;
    max-width: 64px;
    max-height: 64px;
    margin-right: -16px;
    margin-top: -38px;
    border-top-right-radius: 2px;
    opacity: .5;
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
