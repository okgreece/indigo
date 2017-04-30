import {RequestMethod} from '@angular/http';
import {Output} from './output';
import {Input} from './input';
import {environment} from '../../../environments/environment';
import {Algorithm} from "./algorithm";
/**
 * Created by larjo on 28/4/2017.
 */
export class ExecutionConfiguration {


  algorithm: Algorithm;
  inputs: Map<string, Input> = new Map<string, Input>();
  outputs: Map<string, Output> = new Map<string, Output>();
  prompt: string;
  endpoint: URL;
  method: RequestMethod = RequestMethod.Post;
  name: string;
  title: string;

  deserialize(data: any): ExecutionConfiguration {

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



    this.prompt = data.algorithm.prompt;
    this.method = data.algorithm.method;
    this.endpoint = new URL(environment[data.algorithm.endpoint[0]] + '/' + data.algorithm.name);
    this.name = data.name;
    this.title = data.title;

    return this;
  }

}
