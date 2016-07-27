import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AddCommasPipe } from '../../pipes/add-commas';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdButton } from '@angular2-material/button';
import { Cube } from "../../models/cube";
import { TreeBuilder } from "../tree/tree-builder"
import {ExpressionTree} from "../../models/expressionTree";
import { Observable } from 'rxjs/Observable';
import {AggregateNode} from "../../models/aggregate/aggregateNode";
import {FuncNode, FuncType} from "../../models/func/funcNode";
import {TreeActions} from "../../actions/tree";
import {AppState} from "../../reducers/index";
import { Store } from '@ngrx/store';
import {NgChosenComponent} from "../ng-chosen";
import {IterablePipe} from "../../pipes/mapToIterable";

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
  selector: 'cube-detail',
  pipes: [ AddCommasPipe , IterablePipe],
  directives: [ MD_CARD_DIRECTIVES, MD_LIST_DIRECTIVES, MdButton , TreeBuilder, NgChosenComponent ],
  template: require('./cube-detail.html'),
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    md-card {
      max-width: 800px;
    }
    md-card-title {
      margin-left: 10px;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
      margin-bottom: 125px;
    }
    md-card-footer {
      padding-bottom: 75px;
    }
  `]
})
export class CubeDetailComponent {
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
  tree$: Observable<TreeInput>;


  public constructor(    private treeActions: TreeActions,    private store: Store<AppState>

  ){
    let root = new FuncNode(FuncType.Add);
    let expressionTree = new ExpressionTree();
    expressionTree.root = root;
    this.tree$ = Observable.create(function (observer) {
      observer.next(expressionTree);
    }) ;

    this.store.dispatch(this.treeActions.replace(expressionTree));



  }

  get id() {

    return this.cube?this.cube.id:"";
  }

  get name() {
    return this.cube?this.cube.name:"";
  }


  get model() {
    return this.cube.model;
  }

  selectedValueChanged(event){

  }

}
