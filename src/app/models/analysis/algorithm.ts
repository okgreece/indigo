import {Output} from './output';
import {Input} from './input';
import {RequestMethod} from '@angular/http';
import {environment} from '../../../environments/environment';
import {ExecutionConfiguration} from './executionConfiguration';
/**
 * Created by larjo on 12/10/2016.
 */
export class Algorithm {

  name: string;
  title: string;
  description: string;

  configurations: Map<string, ExecutionConfiguration> = new Map<string, ExecutionConfiguration>();


  deserialize(data: any): Algorithm {

    let configurations = new Map<string, ExecutionConfiguration>();


    for (let key of Object.keys(data.configurations)){
      let config =  new ExecutionConfiguration().deserialize(data.input[key]);
      config.algorithm = this;
      configurations.set(key, config);
    }

    this.configurations = configurations;

    this.name = data.name;
    this.title = data.algorithm.title;

    return this;
  }

}
