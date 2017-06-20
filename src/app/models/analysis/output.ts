/**
 * Created by larjo on 12/10/2016.
 */

export enum OutputTypes  {
  TABLE= <any>          'table',
  ADJACENCY_MATRIX= <any>'adjacency matrix',
  OBJECT_COLLECTION= <any>'collection of objects',
  VISUALIZATION_PREFERENCE= <any> 'visualization preference',
  VISUALIZATION_RENDERING= <any>'rendered visualization'
};



export class Output {

  name: string;
  cardinality: number= 1;
  type: OutputTypes;


  deserialize(data: any): Output {


    this.name = data.name;
    this.cardinality = data.cardinality;

    this.type = data.type;


    return this;
  }

  serialize() {
      let output = {};

      output['name'] = this.name;
      output['cardinality'] = this.cardinality;

      output['type'] = this.type;

      return output;
  }
}
