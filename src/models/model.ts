import {Dimension} from "./dimension";
import {Aggregate} from "./aggregate";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";
import {Attribute} from "./attribute";

/**
 * Created by larjo on 25/6/2016.
 */
@JsonObject
export class Model implements Serializable<Model>{
  deserialize(input:Object):Model {

    for(var dimensionName in input.dimensions){
      if(input.dimensions.hasOwnProperty(dimensionName))
        this.dimensions.set(dimensionName, new Dimension().deserialize(input.dimensions[dimensionName]));
    }

    for(var aggregateName in input.aggregates){
      if(input.aggregates.hasOwnProperty(aggregateName))
        this.aggregates.set(aggregateName, new Aggregate().deserialize(input.aggregates[aggregateName]));
    }
    return this;
  }



  @JsonMember({elementType: Dimension})
  dimensions: Map<string, Dimension> = new Map<string,Dimension>() ;

  @JsonMember
  aggregates: Map<string, Aggregate> = new Map<string,Aggregate>();


  private _attributes;
  constructor(){}

  public get attributes(){
    let attributes: Map<string, Attribute> = new Map<string, Attribute>();

    if(this.dimensions.entries) {
      this.dimensions.forEach((value, key) => {
        if(value.attributes.entries) {
          value.attributes.forEach((value, key) => {
            attributes.set(value.ref, value);
          });
        }
      });
    }
    return attributes;
  }
}
