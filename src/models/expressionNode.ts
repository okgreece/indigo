import {Inject} from "@angular/core";
import {Observer} from "rxjs/Rx";
import * as _ from 'lodash';

/**
 * Created by larjo_000 on 26/6/2016.
 */
export class ExpressionNode{

  public constructor(name:string){
    this._name = name;
  }

  private _element:any;

  public _value:any;

  public parent:ExpressionNode;

  public children: ExpressionNode[] = [];

  private _name;

  public get element (){
    return this._element;
  }

  public get name(){
    return this._name;
  }

  public get value(){
    return this._name;
  }


  public executed: boolean = false;

  public toJSON = function () {
    return _.omit(this, [ "parent" ]);
  };

}
