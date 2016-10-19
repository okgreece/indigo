import {Component, Input, Output, EventEmitter, NgModule} from '@angular/core';
import {Cube} from '../../models/cube';
import {Observable} from "rxjs";
import {ExpressionTree} from "../../models/expressionTree";
import {FuncType, FuncNode} from "../../models/func/funcNode";
import * as treeActions from "../../actions/tree";
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {Model} from "../../models/model";
import {TreeBuilder} from "../tree/tree-builder";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgChosenComponent} from "../ng-chosen";
import {MdButton} from "@angular/material";
@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ MdButton , TreeBuilder, NgChosenComponent],

})
@Component({
  selector: 'bc-cube-detail',
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
  `],
  template: require('./cube-detail.html')


})
export class CubeDetailComponent {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() cube: Cube;
  @Input() inCollection: boolean;
  @Output() add = new EventEmitter<Cube>();
  @Output() remove = new EventEmitter<Cube>();
  tree$: Observable<ExpressionTree>;

  public constructor( private store: Store<State>) {
    let root = new FuncNode(FuncType.Addition);
    let expressionTree = new ExpressionTree();
    expressionTree.root = root;
    this.tree$ = Observable.create(function (observer:any) {
      observer.next(expressionTree);
    });
    expressionTree =  expressionTree =  Object.assign({}, expressionTree);
    this.store.dispatch(new treeActions.ReplaceAction(expressionTree));


  }

  get id() {

    return this.cube?this.cube.id:"";
  }

  get name() {
    return this.cube?this.cube.name:"";
  }


  get model():Model {
    return this.cube.model;
  }


}
