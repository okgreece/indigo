import {Attribute} from "./attribute";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

/**
 * Created by larjo on 25/6/2016.
 */
@JsonObject
export class Dimension {
  constructor(){}

  @JsonMember
  label:string;

  @JsonMember
  ref: string;

  @JsonMember
  key_ref: string;

  @JsonMember
  label_ref: string;


  @JsonMember
  key_attribute: string;

  @JsonMember
  label_attribute: string;

  @JsonMember
  orig_dimension: string;

  @JsonMember
  hierarchy: string;

  @JsonMember
  attributes: Map<string, Attribute>;


}
