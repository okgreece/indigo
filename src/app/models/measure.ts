import {Serializable} from './iserializeable';
/**
 * Created by larjo_000 on 27/6/2016.
 */

export class Measure implements Serializable<Measure> {
  serialize(input: Measure): Object {
    return this;
  }
  deserialize(input: any): Measure {

    this.ref = input.ref;
    this.orig_measure = input.orig_measure;
    this.currency = input.currency;
    this.label = input.label;

    return this;
  }





  ref: string;
  column: string;

  orig_measure: string;
  currency: string;

  label: string;
}
