import { Component, Input } from '@angular/core';
import { Cube } from '../../models/cube';

@Component({
  selector: 'bc-cube-preview-list',
  template: `
    <bc-cube-preview *ngFor="let cube of cubes" [cube]="cube"></bc-cube-preview>
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
  @Input() cubes: Cube[];
}
