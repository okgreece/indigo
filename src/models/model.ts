import {Dimension} from "./dimension";
import {Aggregate} from "./aggregate";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

/**
 * Created by larjo on 25/6/2016.
 */
@JsonObject
export class Model{
  @JsonMember
  dimensions: Map<string, Dimension> ;

  @JsonMember
  aggregates: Map<string, Aggregate>;


  private _attributes;
  constructor(){}

  public get attributes(){
    let attributes = {};
    debugger;

    for(var dimension in this.dimensions){
      debugger;
      for(var attribute in dimension.attributes){
        attributes[attribute.ref] = attribute;
      }
    }
    debugger;
    return attributes;
  }
}
