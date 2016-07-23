import {Attribute} from "./attribute";
import {SortDirection} from "./sortDirection";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Sort{
  column: Attribute;
  direction: SortDirection = SortDirection.asc;
}
