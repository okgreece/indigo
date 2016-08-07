import {ExpressionNode} from "./expressionNode";
import * as _ from 'lodash';
import {FuncNode} from "./func/funcNode";
import {AggregateNode} from "./aggregate/aggregateNode";

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionTree implements Serializable<ExpressionTree>{

   root: ExpressionNode;
   id: string;

  deserialize(input:Object):ExpressionTree {
    this.id = input.id;

    switch(input.root.__type){
      case "FuncNode":
        //this.root = new FuncNode().deserialize(input.root);
        break;
      case "AggregateNode":
       // this.root = new AggregateNode().deserialize(input.root);
        break;

    }
    return this;

  }


  public  toJSON () {
    return _.extend({__type:this.constructor.name}, this);
  };


  serialize(input: ExpressionTree): Object {
    return this;
  }

}
