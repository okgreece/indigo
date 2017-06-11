import {Component, Input} from '@angular/core';
import {Cube} from '../../../models/cube';


@Component({
  selector: 'indigo-cube-analytics-preview',
  template: `
    <md-card class="algo-card">
      <md-card-header class="">
        <md-card-title>{{ algorithm.title }}</md-card-title>
        <span class="indigo-spacer"></span>

        <button [md-tooltip]="'Perform analysis: '+configuration.title"
                *ngFor="let configuration of algorithm?.configurations|iterable"
                md-icon-button [routerLink]="'/cube/analytics/' + cubeId+ '/'+algorithm.name+ '/'+configuration.name">
          <md-icon>play_circle_outline
          </md-icon>
        </button>


      </md-card-header>
      <md-card-content>
        <p>
          {{algorithm.description}}

        </p>
      </md-card-content>
    </md-card>

  `,
  styles: [`
    md-card {
      width: 400px;
      margin: 15px;
      background: #f7f7f7;
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
      text-align: justify;
    }

    span {
      display: inline-block;
      font-size: 13px;
    }

    md-card-footer {
      padding: 0 25px 25px;
    }

    :host {
      display: flex;
      justify-content: center;

    }

    md-card-title {
      justify-content: center;
      align-items: center;
      display: flex;
      margin-bottom: 0;
    }

    md-card.algo-card md-card-header {
      background: #82BF5E;
    }

  `]
})
export class CubeAnalyticsPreviewComponent {
  @Input() algorithm: Algorithm;
  @Input() cube: Cube;


  get cubeId() {
    return this.cube.name;
  }

  get id() {
    return this.algorithm.name;
  }

  get title() {
    return this.algorithm.name;
  }

}
