import { Component } from '@angular/core';


@Component({
  selector: 'bc-layout',
  template: `
    <md-sidenav-layout fullscreen>
      
      <ng-content></ng-content>

    </md-sidenav-layout>
  `,
  styles: [`

    
    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class LayoutComponent { }
