/**
 * Created by larjo_000 on 27/6/2016.
 */

import * as _ from 'lodash';

export abstract class Value implements Serializable<Value>{

  public abstract invoke(input:any);

  public get label():string{
    return undefined;
  }

  public get symbol():string{
    return 'V';
  }

  public toJSON = function () {
    return _.extend( {name:this.name, symbol:this.symbol, __type:this.constructor.name}, this);
  };

  deserialize(input:Object):Value {

  }

  serialize(){
    return this
  }
}
