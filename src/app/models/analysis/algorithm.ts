import {Output} from './output';
import {Input} from './input';
import {Type} from '@angular/core';
import {RequestMethod} from '@angular/http';
import {environment} from "../../../environments/environment";
/**
 * Created by larjo on 12/10/2016.
 */
export class Algorithm {

  inputs: Map<string, Input> = new Map<string, Input>();
  outputs: Map<string, Output> = new Map<string, Output>();
  name: string;
  title: string;

  visualizations: Array<Type<any> | any[]>;

  endpoint: URL;
  method: RequestMethod = RequestMethod.Post;
  prompt: string;


  deserialize(data: any): Algorithm {

    let inputs = new Map<string, Input>();


    for (let key of Object.keys(data.input)){
      inputs.set(key, new Input().deserialize(data.input[key]));
    }

    this.inputs = inputs;



    let outputs = new Map<string, Output>();


    for (let key of Object.keys(data.output)){
      outputs.set(key, new Output().deserialize(data.output[key]));
    }

    this.outputs = outputs;


    this.name = data.name;
    this.title = data.algorithm.title;
    this.prompt = data.algorithm.prompt;
    this.method = data.algorithm.method;
    this.endpoint = environment[data.algorithm.endpoint[0]] + data.algorithm.endpoint[1];


    return this;
  }

}
