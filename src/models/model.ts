import {Dimension} from "./dimension";
import {Aggregate} from "./aggregate";
import {Type, plainToConstructor} from "constructor-utils";

/**
 * Created by larjo on 25/6/2016.
 */
export class Model{
  @Type(() => Map<string, Dimension>)
  dimensions: Map<string, Dimension> = [];

  @Type(() => Aggregate)
  aggregates: Aggregate[] = [];


  private _attributes;

  public get attributes(){
    let attributes = {};

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
