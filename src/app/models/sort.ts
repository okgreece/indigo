import {Attribute} from "./attribute";
import {SortDirection} from "./sortDirection";
import {Serializable} from "./iserializeable";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Sort implements Serializable<Sort>{
  deserialize(input: any): Sort {
    return input;
  }

  serialize(input: Sort): Object {
    return this;
  }
  column: Attribute;
  direction: SortDirection = SortDirection.asc;
}
