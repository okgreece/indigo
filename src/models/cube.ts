import {Model} from "./model";
import {Type, plainToConstructor} from "constructor-utils";

export class Cube {
  id: string;
  name: string;

  @Type(() => Model)
  model: Model;
}
