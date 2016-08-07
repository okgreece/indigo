import {Attribute} from "./attribute";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

/**
 * Created by larjo on 25/6/2016.
 */
@JsonObject
export class Dimension implements Serializable<Dimension> {
  deserialize(input:Object):Dimension {
    this.label = input.label;
    this.ref = input.ref;
    this.label_attribute = input.label_attribute;
    this.key_attribute = input.key_attribute;
    this.label_ref = input.label_ref;
    this.key_ref = input.key_ref;
    this.orig_dimension = input.orig_dimension;
    this.hierarchy = input.hierarchy;

    for(var attributeName in input.attributes){
      if(input.attributes.hasOwnProperty(attributeName)){
        let newAttribute = new Attribute().deserialize(input.attributes[attributeName]);
        newAttribute.dimension = this;
        this.attributes.set(attributeName, newAttribute);
      }

    }

    return this;
  }
  constructor(){}
  serialize(input: Dimension): Object {
    return this;
  }
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
  attributes: Map<string, Attribute> = new Map<string,Attribute>();


}
