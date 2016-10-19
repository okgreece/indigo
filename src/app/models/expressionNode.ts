import {Inject} from "@angular/core";
import {Observer} from "rxjs/Rx";
import * as _ from 'lodash';
import {AggregateNode} from "./aggregate/aggregateNode";
import {Component, forwardRef} from '@angular/core';
import {FuncNode} from "./func/funcNode";
import {Serializable} from "./iserializeable";

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionNode implements Serializable<ExpressionNode>{

  deserialize(input:any):ExpressionNode {

    return input;

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

    return _.extend({__type:this.constructor.name, element:this.element, symbol:this.symbol},_.omit(this, [ "parent", "toJSON" ]));
  };

  get children(): any {
    return this._children;
  }

  set children(value: any) {
    this._children = value;
  }
  get y0(): number {
    return this._y0;
  }

  set y0(value: number) {
    this._y0 = value;
  }
  get x0(): number {
    return this._x0;
  }

  set x0(value: number) {
    this._x0 = value;
  }

  private _x0:number;
  private _y0:number;
  private _children:any;


}
