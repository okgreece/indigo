import {ExpressionNode} from "./expressionNode";
/**
 * Created by larjo_000 on 27/6/2016.
 */

import {JsonMember,JsonObject} from "typedjson/src/typed-json";

@JsonObject
export class Aggregate{
  @JsonMember
  ref: string;
}
