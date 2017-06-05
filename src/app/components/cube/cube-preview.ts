import {Component, Input} from '@angular/core';
import {Cube} from '../../models/cube';


@Component({
  selector: 'indigo-cube-preview',
  template: `
    <md-card>
      <md-card-title-group align="center center">

        <md-card-title>{{ cube.pckg.title }}</md-card-title>
        <md-card-subtitle>{{ cube.pckg.author }}</md-card-subtitle>
        <span md-card-md-image class="flag-icon flag-icon-{{ cube.pckg.countryCode?.toLowerCase() }}"></span>

      </md-card-title-group>
      <div class="row text-center">
        <a [routerLink]="'/cube/analytics/' + cube.id" color="primary" md-raised-button>Analytics & Data Mining
        </a>
        <!--
            <button [routerLink]="'/cube/indicators/' + cube.id" md-raised-button>Indicators Builder</button>
        -->
      </div>

    </md-card>

  `,
  styles: [`
    md-card-title {
      font-size: 18px;
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

    .flag-icon {
      width: 48px;
      height: 36px;
      min-width: 48px;
      min-height: 36px;
      max-width: 48px;
      max-height: 36px;
      margin-right: -16px;
      margin-top: -20px;

      opacity: .75;
      transform: rotate(90deg);

      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
      transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1);
      will-change: box-shadow;

      border-radius: 2px;

    }

    md-card-title-group {
      overflow-wrap: break-word;
      word-wrap: break-word;

      -ms-word-break: break-all;
      /* This is the dangerous one in WebKit, as it breaks things wherever */
      word-break: break-all;
      /* Instead use this non-standard one: */
      word-break: break-word;

      /* Adds a hyphen where the word breaks, if supported (No Blink) */
      -ms-hyphens: auto;
      -moz-hyphens: auto;
      -webkit-hyphens: auto;
      hyphens: auto;
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
