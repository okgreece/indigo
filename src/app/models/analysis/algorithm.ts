import {ExecutionConfiguration} from './executionConfiguration';
/**
 * Created by larjo on 12/10/2016.
 */
export class Algorithm {

  public name: string;
  public title: string;
  description: string;

  public configurations: Map<string, ExecutionConfiguration> = new Map<string, ExecutionConfiguration>();


  deserialize(data: any): Algorithm {

    let configurations = new Map<string, ExecutionConfiguration>();


    for (let key of Object.keys(data.configurations)){
      let config =  new ExecutionConfiguration().deserialize(data.configurations[key]);
      config.algorithm = this;
      configurations.set(key, config);
    }

    this.configurations = configurations;

    this.name = data.name;
    this.description = data.description;
    this.title = data.title;

    return this;
  }
  serialize(): any {

    let output = {};

    output['configurations'] = {};

    this.configurations.forEach(function(value, key){
      output['configurations'][key] = value.serialize();
    });



    output['name'] = this.name;
    output['title'] = this.title;
    output['description'] = this.description;



    return output;
  }

}
