/**
 * Created by larjo on 16/7/2016.
 */
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

@JsonObject
export class Attribute {
  constructor(){}

  @JsonMember
  ref:string;
  @JsonMember
  datatype:string;
  @JsonMember
  label:string;
  @JsonMember
  orig_attribute:string;
}
