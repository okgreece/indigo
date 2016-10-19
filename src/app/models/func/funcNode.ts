import {ExpressionNode} from "../expressionNode";
import {Func} from "./func";
import {Add} from "./add";
import {Difference} from "./difference";
import {Multiplication} from "./multiplication";
import {Division} from "./division";
import {Exponential} from "./exponential";
import {Logarithm} from "./logarithm";
import {Minimum} from "./minimum";
import {Maximum} from "./maximum";
import {Average} from "./average";
import {Negation} from "./negation";
import * as _ from 'lodash';
import {AggregateNode} from "../aggregate/aggregateNode";
/**
 * Created by larjo_000 on 27/6/2016.
 */

export enum FuncType{
  Addition,
  Difference,
  Multiplication,
  Division,
  Exponential,
  Negation,
  Logarithm,
  Maximum,
  Minimum,
  Average
}

export class FuncNode extends ExpressionNode {

  get label(): string {
    return this._func.label;
  }



  serialize(input: FuncNode): Object {
    return this;
  }

  deserialize(input:any):FuncNode {

    let children = [];


    for(var child of input._children){

      switch (child.__type){
        case "FuncNode":
          children.push(FuncNode.factory().deserialize(child));
          break;
        case "AggregateNode":
          children.push(new AggregateNode().deserialize(child));
          break;
      }

    }
    this._children = children;
    switch (input.element.__type){
      case Add.constructor.name:
        this._func =  new Add();
        break;

      case Difference.constructor.name:
        this._func =  new Difference();
        break;

      case Division.constructor.name:
        this._func =  new Division();
        break;

      case Exponential.constructor.name:
        this._func =  new Exponential();
        break;

      case Logarithm.constructor.name:
        this._func =  new Logarithm();
        break;

      case Maximum.constructor.name:
        this._func =  new Maximum();
        break;

      case Minimum.constructor.name:
        this._func =  new Minimum();
        break;

      case Negation.constructor.name:
        this._func =  new Negation();
        break;

      case Multiplication.constructor.name:
        this._func =  new Multiplication();
        break;

      case Average.constructor.name:
        this._func =  new Average();
        break;

    }

    return this;
  }



  public constructor(funcType: FuncType) {

    super(undefined);
    this._children = [];
    switch (funcType) {
      case FuncType.Addition:
        this.element = new Add();
        break;
      case FuncType.Difference:
        this.element = new Difference();
        break;
      case FuncType.Multiplication:
        this.element = new Multiplication();
            break;
      case FuncType.Division:
            this.element=  new Division();
            break;
      case FuncType.Exponential:
        this.element = new Exponential();
            break;
      case FuncType.Logarithm:
        this.element = new Logarithm();
            break;
      case FuncType.Minimum:
        this.element = new Minimum();
            break;
      case FuncType.Maximum:
        this.element = new Maximum();
            break;
      case FuncType.Average :
        this.element = new Average();
            break;
      case FuncType.Negation:
        this.element = new Negation();
            break;

    }
  }


  public static factory(){
    return new FuncNode(FuncType.Addition);
  }



  public _func: Func;

  public get element(): Func {
    return this._func;
  };

  public set element(value: Func) {
    this._func = value;
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
