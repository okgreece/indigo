import {ExpressionNode} from "../expressionNode";

import * as _ from 'lodash';
import {AggregateNode} from "../aggregate/aggregateNode";
import {Value} from "./val";
/**
 * Created by larjo_000 on 27/6/2016.
 */


export class ValueNode extends ExpressionNode {
  get label(): string {
    return "Value";
  }



  serialize(input: ValueNode): Object {
    return this;
  }

  deserialize(input:Object):ValueNode {

    this._val = input.element;


    return this;
  }


  public _val: Value;

  public get element(): Value {
    return this._val  ;
  };

  public set element(value: Value) {
    this._val  = value;
  };

  public set value(value) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public get symbol(){
    return this.element.symbol;
  }





}
