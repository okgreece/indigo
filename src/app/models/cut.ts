import {Attribute} from './attribute';
import {Transitivity} from './transitivity';
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Cut {

  column: Attribute;
  value: any;
  transitivity: Transitivity = Transitivity.staticFactory().find(t => t.key === '');

  deserialize(input: any): Cut {

    this.column = new Attribute().deserialize(input.column);
    this.transitivity = new Transitivity().deserialize(input.transitivity);
    this.value = input.value;


    return this;
  }
}
