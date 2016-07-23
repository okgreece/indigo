import {Model} from "./model";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

@JsonObject
export class Cube implements Serializable<Cube>{
  deserialize(input:Object):Cube {

    this.name = input.name;
    this.model = new Model().deserialize(input.model);

    return this;
  }
  constructor(){}

  @JsonMember
  id:number;
  @JsonMember
  name: string;

  @JsonMember
  model: Model;
}
