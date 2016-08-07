import {Model} from "./model";
import {Type, plainToConstructor} from "constructor-utils";

export class Cube implements Serializable<Cube>{
  deserialize(input:Object):Cube {

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
