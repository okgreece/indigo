import {Output} from "./output";
import {Input} from "./input";
import {Type} from "@angular/core";
import {HttpModule, RequestMethod} from "@angular/http";
import {Url} from "url";
/**
 * Created by larjo on 12/10/2016.
 */
export class Algorithm{

  inputs: Map<string, Input> = new Map<string, Input>();
  outputs: Map<string, Output> = new Map<string, Output>();
  name:string;
  title:string;

  visualizations: Array<Type<any> | any[]>;

  endpoint: URL;
  method:RequestMethod= RequestMethod.Post;



}
