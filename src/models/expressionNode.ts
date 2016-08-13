import {Inject} from "@angular/core";
import {Observer} from "rxjs/Rx";
import * as _ from 'lodash';
import {AggregateNode} from "./aggregate/aggregateNode";
import {Component, forwardRef} from '@angular/core';
import {FuncNode} from "./func/funcNode";

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionNode implements Serializable<ExpressionNode>{

  deserialize(input:Object):ExpressionNode {



  }

  serialize(input: ExpressionNode): Object {
    return this;
  }

  public constructor(name:string){
    this._label = name;

  }


  private _element:any;

  public _value:any;

  public parent:ExpressionNode;

  public children: ExpressionNode[] = [];

  private _label;

  public get element (){
    return this._element;
  }

  public get label(){
    return this._label;
  }

  public get value(){
    return this._label;
  }


  public executed: boolean = false;

  public toJSON = function () {
    debugger;

    return _.extend({__type:this.constructor.name, element:this.element, symbol:this.symbol},_.omit(this, [ "parent" ]));
  };



}
