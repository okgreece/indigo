import {Inject} from "@angular/core";
import {Observer} from "rxjs/Rx";
import * as _ from 'lodash';
import {FuncNode} from "./func/funcNode";
import {AggregateNode} from "./aggregate/aggregateNode";

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionNode implements Serializable<ExpressionNode>{

  deserialize(input:Object):ExpressionNode {


    let children = [];


    for(var child of input.children){
      debugger;

      switch (child.__type){
        case "FuncNode":
           children.push(new FuncNode().deserialize(input.root));
          break;
        case "AggregateNode":
         children.push(new AggregateNode().deserialize(input.root));
          break;
      }

    }
    this.children = children;
    return this;
  }

  serialize(input: ExpressionNode): Object {
    return this;
  }

  public constructor(name:string){
    this._name = name;
  }

  private _element:any;

  public _value:any;

  public parent:ExpressionNode;

  public children: ExpressionNode[] = [];

  private _name;

  public get element (){
    return this._element;
  }

  public get name(){
    return this._name;
  }

  public get value(){
    return this._name;
  }


  public executed: boolean = false;

  public toJSON = function () {

    return _.extend({__type:this.constructor.name, element:this.element, symbol:this.symbol},_.omit(this, [ "parent" ]));
  };



}
