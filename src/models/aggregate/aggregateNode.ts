import {ExpressionNode} from "../expressionNode";
import {AggregateRequest} from "./aggregateRequest";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class AggregateNode extends ExpressionNode{
  static get name():string {
    return "Aggregate";
  }

  _aggregate : AggregateRequest;

  public constructor(){
    super(AggregateNode.name);
    this.children = [];
  }

  public get element():AggregateRequest{
    return this._aggregate;
  };
  public set element(value: AggregateRequest){
    this._aggregate = value;
  };

  _value:any;

  public set value(value){
    this._value = value;
  }
  public get value(){
    return this._value ;
  }

}
