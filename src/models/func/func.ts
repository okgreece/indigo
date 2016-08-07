/**
 * Created by larjo_000 on 27/6/2016.
 */

import * as _ from 'lodash';

export abstract class Func implements Serializable<Func>{

  public abstract invoke(input:any);

  public get name():string{
    return undefined;
  }

  public get symbol():string{
    return 'F';
  }

  public toJSON = function () {
    debugger;


    return _.extend( {name:this.name, symbol:this.symbol, __type:this.constructor.name}, this);
  };

  deserialize(input:Object):Func {
  }

  serialize(){
    return this
  }
}
