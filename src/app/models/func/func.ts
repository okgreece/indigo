/**
 * Created by larjo_000 on 27/6/2016.
 */

import * as _ from 'lodash';
import {Serializable} from "../iserializeable";

export abstract class Func implements Serializable<Func>{

  public abstract invoke(input:any);

  public get label():string{
    return undefined;
  }

  public get symbol():string{
    return 'F';
  }

  public toJSON = function () {
    return _.extend( {name:this.name, symbol:this.symbol, __type:this.constructor.name}, this);
  };

  deserialize(input:any):Func {
    return input;
  }

  serialize(){
    return this
  }
}
