import {Attribute} from "./attribute";
import {Type, plainToConstructor} from "constructor-utils";

/**
 * Created by larjo on 25/6/2016.
 */
export class Dimension {

  label:string;
  ref: string;
  key_ref: string;
  label_ref: string;
  orig_dimension: string;

  @Type(() => Attribute)
  attributes: Attribute[] = [];
}
