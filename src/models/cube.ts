import {Model} from "./model";
import {Type, plainToConstructor} from "constructor-utils";
import {JsonMember,JsonObject} from "typedjson/src/typed-json";

@JsonObject
export class Cube {
  constructor(){}

  @JsonMember
  id:number;
  @JsonMember
  name: string;

  @JsonMember
  model: Model;
}
