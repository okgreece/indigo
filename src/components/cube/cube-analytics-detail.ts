import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgIf, NgFor, AsyncPipe} from '@angular/common';

import { AddCommasPipe } from '../../pipes/add-commas';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { Cube } from "../../models/cube";
import { TreeBuilder } from "../tree/tree-builder"
import {ExpressionTree} from "../../models/expressionTree";
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs/tabs';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdInput} from '@angular2-material/input/input';
import {MdButton, MdAnchor} from '@angular2-material/button/button';
import {MdIcon} from '@angular2-material/icon/icon';
import {AppState} from "../../reducers/index";
import { Store } from '@ngrx/store';
import {NgChosenComponent} from "../ng-chosen";
import {IterablePipe} from "../../pipes/mapToIterable";
import {JsonTreeComponent} from "../../lib/json-tree/json-tree";

/**
 * Tip: Export type aliases for your component's inputs and outputs. Until we
 * get better tooling for templates, this helps enforce you are using a
 * component's API with type safety.
 */
export type CubeInput = Cube;
export type TreeInput = ExpressionTree;
export type InCollectionInput = boolean;
export type AddOutput = Cube;
export type RemoveOutput = Cube;

@Component({
  selector: 'cube-analytics-detail',
  pipes: [ AddCommasPipe , IterablePipe],
  directives: [ MD_CARD_DIRECTIVES, MD_LIST_DIRECTIVES, MdButton , TreeBuilder, NgChosenComponent,  NgChosenComponent, JsonTreeComponent, MD_TABS_DIRECTIVES, MdToolbar, MdInput, NgIf, NgFor,MdButton, MdAnchor, MdIcon,],
  template: require('./cube-analytics-detail.html'),
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
    md-card {
      max-width: 90%;
      min-width: 90%;
    }
    md-card-title {
      margin-left: 10px;
    }
    img {
      max-width: 100%;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
      margin-bottom: 125px;
    }
    md-card-footer {
      padding-bottom: 75px;
    }
    
     md-toolbar-row [md-mini-fab]{
      margin:2px;
    
    }
    
  `]
})
export class CubeAnalyticsDetailComponent {
  /**
   * Dumb components receive data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'dumb' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   *
   * Tip: Utilize getters to keep templates clean in 'dumb' components.
   */
  @Input() cube: CubeInput;
  @Input() inCollection: InCollectionInput;
  @Output() add = new EventEmitter<AddOutput>();
  @Output() remove = new EventEmitter<RemoveOutput>();


  public constructor(private store: Store<AppState> ){


  }

  get id() {

    return this.cube?this.cube.id:"";
  }

  get name() {
    return this.cube?this.cube.name:"";
  }




  selectedValueChanged(event){

  }

}
