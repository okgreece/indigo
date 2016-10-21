import {ExpressionNode} from "./expressionNode";
import {Aggregate} from "./aggregate";
import {Serializable} from "./iserializeable";
/**
 * Created by larjo on 16/7/2016.
 */
export class AggregateParam implements Serializable<AggregateParam>{
  deserialize(input: any): AggregateParam {
    let _aggregate = new Aggregate().deserialize(input.column);
    let newAggregateParam = new AggregateParam();
    newAggregateParam.column = _aggregate;
    return newAggregateParam;  }

  serialize(input: AggregateParam): any {
    return input;
  }
  column:Aggregate;

}
