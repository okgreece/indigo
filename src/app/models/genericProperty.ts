import {Attribute} from "./attribute";

export abstract class GenericProperty {

  public ref;

  public isAttribute() {
    return this instanceof Attribute;
  }
}
