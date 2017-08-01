import {Aggregate} from './aggregate';
import {Serializable} from './iserializeable';
/**
 * Created by larjo on 16/7/2016.
 */
export class AggregateParam implements Serializable<AggregateParam>{
  column: Aggregate;

  deserialize(input: any): AggregateParam {
    const _aggregate = new Aggregate().deserialize(input.column);
    const newAggregateParam = new AggregateParam();
    newAggregateParam.column = _aggregate;
    return newAggregateParam;  }

  serialize(input: AggregateParam): any {
    return input;
  }

}
