/**
 * Created by larjo on 14/7/2016.
 */
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from 'rxjs/Observable';
import {RudolfCubesService} from "./rudolf-cubes";
import {ExpressionNode} from "../models/expressionNode";
import {AggregateNode} from "../models/aggregate/aggregateNode";
import {ExpressionTree} from "../models/expressionTree";
import {AppState} from "../reducers/index";
import {TreeActions} from "../actions/tree";
import {Cube} from "../models/cube";
import 'rxjs/add/operator/mergeMap'
import {FuncNode} from "../models/func/funcNode";

@Injectable()
export class TreeExecution {

  constructor(private rudolfCubesService: RudolfCubesService, private store:Store<AppState>, private treeActions:TreeActions) {}

    execute(expressionTree: ExpressionTree, rootNode:ExpressionNode){
      let that = this;
      if(rootNode instanceof AggregateNode){
        let observable = this.rudolfCubesService.aggregate(rootNode.element).share();
        observable.subscribe(response=>{
          rootNode.value = response;
          rootNode.executed = true;
          that.store.dispatch(this.treeActions.replace(expressionTree));
         // return rootNode.value;

        });

        return observable;

        /* .catch(() => Observable.of(this.cubeActions.searchComplete([]));*/
      }
      else if(rootNode instanceof FuncNode) {


        let observables = [];

        rootNode.children.map(function (child) {
          return child.value;
        });

        rootNode.children.forEach((child) => {
          observables.push(this.execute(expressionTree, child));
        });

        let observable = Observable.forkJoin(observables).share();
        observable.subscribe(response=>{
          let data = rootNode.children.map(function (child) {
            return child.value;
          });
          rootNode.value = rootNode.element.invoke(data);
          rootNode.executed = true;
          that.store.dispatch(that.treeActions.replace(expressionTree));
        });

        return observable;


      }


    }

}
