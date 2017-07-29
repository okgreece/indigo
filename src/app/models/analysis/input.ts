/**
 * Created by larjo on 12/10/2016.
 */


export enum InputTypes  {
  PARAMETER= <any>'Algorithm parameter',
  ATTRIBUTE_REF= <any>'Cube Dimension Attribute',
  MEASURE_REF= <any>'Cube Measure',
  AGGREGATE_REF= <any>'Cube Aggregate',
  QUERY= <any>'Query to the data store',
  RAW_DATA= <any>'Raw data',
  RAW_DATA_URI= <any>'URI pointing to raw data',
  BABBAGE_AGGREGATE_URI= <any>'URI pointing to a Babbage compliant aggregates API request',
  BABBAGE_AGGREGATE_RAW_DATA= <any>'Raw data coming from a Babbage compliant aggregates API request',
  BABBAGE_FACT_URI= <any>'URI pointing to a Babbage compliant facts API request',
  BABBAGE_FACT_RAW_DATA= <any>'Raw data coming from a Babbage compliant facts API request',
  BABBAGE_MEMBER= <any>'Member values from a dimension'
}



export class Input {

  name: string;
  cardinality = '1';
  description: string;
  type: InputTypes;
  title: string;
  data_type: string;
  default_value: any;
  guess: boolean;
  required: boolean;
  data: any;
  options: any;

  deserialize(data: any): Input {


    this.name = data.name;
    this.title = data.title;
    this.cardinality = data.cardinality;
    this.guess = data.guess;
    this.default_value = data.default_value;
    this.required = data.required;
    this.data_type = data.data_type;
    this.type = data.type;
    this.options = data.options;
    this.description = data.description;


    return this;
  }

  serialize() {
    const output = {};

    output['name'] = this.name;
    output['title'] = this.title;
    output['cardinality'] = this.cardinality;
    output['guess'] = this.guess;
    output['default_value'] = this.default_value;
    output['required'] = this.required;
    output['data_type'] = this.data_type;
    output['type'] =   this.type;
    output['options'] =   this.options;
    output['description'] =   this.description;

    return output;
  }
}

