import {Attribute} from "./attribute";
import {Serializable} from "./iserializeable";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Drilldown implements Serializable<Drilldown>{
  deserialize(input: any): Drilldown {
    let _attribute = new Attribute().deserialize(input.column);
    let newDrilldown = new Drilldown();
    newDrilldown.column = _attribute;
    return newDrilldown;
  }

  serialize(input: Drilldown): any {
    return input;
  }
  column:Attribute;
}
