import {Model} from "./model";
import {Serializable} from "./iserializeable";

export class Cube implements Serializable<Cube>{
  deserialize(input:any):Cube {

    this.name = input.name;
    this.model = new Model().deserialize(input.model);
    this.pckg = input.pckg;

    return this;
  }
  serialize(input: Cube): Object {
    return this;
  }
  constructor(){}


  pckg: any;

  id:number;
  name: string;
  model: Model;
}
