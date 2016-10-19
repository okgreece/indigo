import {Attribute} from "./attribute";
import {Serializable} from "./iserializeable";


/**
 * Created by larjo on 25/6/2016.
 */
export class Dimension implements Serializable<Dimension> {
  deserialize(input:any):Dimension {
    this.label = input.label;
    this.ref = input.ref;
    this.label_attribute = input.label_attribute;
    this.key_attribute = input.key_attribute;
    this.label_ref = input.label_ref;
    this.key_ref = input.key_ref;
    this.orig_dimension = input.orig_dimension;
    this.hierarchy = input.hierarchy;

    for(let attributeName in input.attributes){
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

  label:string;

  ref: string;

  key_ref: string;

  label_ref: string;


  key_attribute: string;

  label_attribute: string;

  orig_dimension: string;

  hierarchy: string;

  attributes: Map<string, Attribute> = new Map<string,Attribute>();


}
