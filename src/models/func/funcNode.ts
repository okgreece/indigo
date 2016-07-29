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
  get name(): string {
    return this._func.name;
  }


  public constructor(funcType: FuncType) {

    super(undefined);
    this.children = [];
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

  _func: Func;

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
