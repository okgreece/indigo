import {Model} from "./model";
import {Serializable} from "./iserializeable";

export class Cube implements Serializable<Cube>{
  deserialize(input:any):Cube {
debugger;
    this.name = input.name;
    if(input.id)this.id = input.id;
    this.model = new Model().deserialize(input.model);
    this.pckg = input.pckg;

    return this;
  }
  serialize(input: Cube): Object {
    return this;
  }
  constructor(){}


  pckg: any;

  id:string;
  name: string;
  model: Model;
}
