import {RequestMethod} from '@angular/http';
import {Output} from './output';
import {Input} from './input';
import {Algorithm} from './algorithm';
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

    const inputs = new Map<string, Input>();


    for (const key of Object.keys(data.inputs)){
      inputs.set(key, new Input().deserialize(data.inputs[key]));
    }

    this.inputs = inputs;



    const outputs = new Map<string, Output>();


    for (const key of Object.keys(data.outputs)){
      outputs.set(key, new Output().deserialize(data.outputs[key]));
    }

    this.outputs = outputs;



    this.prompt = data.prompt;
    this.method = data.method;
    this.endpoint = new URL(data.endpoint );
    this.name = data.name;
    this.title = data.title;

    return this;
  }

  serialize() {

    const output = {};

    output['inputs'] = {};

    this.inputs.forEach(function (value, key) {
      output['inputs'][key] = value.serialize();
    });

    output['outputs'] = {};

    this.outputs.forEach(function (value, key) {
      output['outputs'][key] = value.serialize();
    });

    output['prompt'] = this.prompt;
    output['method'] = this.method;
    output['endpoint'] = this.endpoint.toString();
    output['name'] = this.name;
    output['title'] = this.title;




    return output;
  }
}
