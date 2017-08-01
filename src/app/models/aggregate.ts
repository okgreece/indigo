import {Serializable} from './iserializeable';
import {GenericProperty} from './genericProperty';
/**
 * Created by larjo_000 on 27/6/2016.
 */

export class Aggregate extends  GenericProperty implements Serializable<Aggregate> {
  ref: string;
  measure: string;
  label: string;

  serialize(input: Aggregate): Object {
    return this;
  }

  deserialize(input: any): Aggregate {

    this.ref = input.ref;
    this.measure = input.measure;
    this.label = input.label;

    return this;
  }
}
