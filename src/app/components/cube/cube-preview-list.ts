import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {Cube} from '../../models/cube';


@Component({
  selector: 'indigo-cube-preview-list',
  template: `
<div class="wrapper-flex">
    <masonry [options]="{ fitWidth : true }">
      <masonry-brick class="brick" *ngFor="let cube of cubes">
        <indigo-cube-preview [cube]="cube"></indigo-cube-preview>
      </masonry-brick>
    </masonry>
</div>
  `,
  styles: [`

    masonry {
      margin: 0 auto;
      text-align: center;

    }



  `]
})
export class CubePreviewListComponent {
  @Input() cubes: Cube[];







  constructor() {


  }

}
