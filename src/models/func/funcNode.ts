import {ExpressionNode} from "../expressionNode";
import {Func} from "./func";
import {Add} from "./add";
/**
 * Created by larjo_000 on 27/6/2016.
 */

export enum FuncType{
  Add
}

export class FuncNode extends ExpressionNode{
  get name():string {
    return this._func.name;
  }



  public constructor(funcType: FuncType){

    super(undefined);
    this.children = [];
    switch (funcType){
      case FuncType.Add:
        this.element = new Add();
        break;

    }
  }

  _func:Func;

  public get element():Func{
    return this._func;
  };
  public set element(value: Func){
    this._func = value;
  };
}
