/**
 * Created by larjo on 12/10/2016.
 */


export const InputTypes = {
  PARAMETER: 'Algorithm parameter',
  ATTRIBUTE_REF: 'Cube Dimension Attribute',
  MEASURE_REF: 'Cube Measure',
  AGGREGATE_REF: 'Cube Aggregate',
  QUERY: 'Query to the data store',
  RAW_DATA: 'Raw data',
  RAW_DATA_URI: 'URI pointing to raw data',
  BABBAGE_URI: 'URI pointing to a Babbage compliant API request',
  BABBAGE_RAW_DATA: 'Raw data coming from a Babbage compliant API request',
};



export class Input{

  name: string;
  cardinality: number =1;
  type: string;
  title: string;

}
