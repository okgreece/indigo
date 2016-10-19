import {Model} from "./model";
import {Serializable} from "./iserializeable";

export class Cube implements Serializable<Cube>{
  deserialize(input:any):Cube {

    this.name = input.name;
    this.model = new Model().deserialize(input.model);

    return this;
  }
  serialize(input: Cube): Object {
    return this;
  }
  constructor(){}

  id:number;
  name: string;
  model: Model;
}
