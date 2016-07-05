import { Component, Input } from '@angular/core';

import { CubePreviewComponent, CubeInput } from './cube-preview';

export type CubesInput = CubeInput[];

@Component({
  selector: 'cube-preview-list',
  directives: [ CubePreviewComponent ],
  template: `
    <cube-preview *ngFor="let cube of cubes" [cube]="cube"></cube-preview>
  `,
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `]
})
export class CubePreviewListComponent {
  @Input() cubes: CubesInput;
}
