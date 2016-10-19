/**
 * Created by larjo on 12/10/2016.
 */

export const OutputTypes = {
  TABLE:           'table',
  ADJACENCY_MATRIX: 'adjacency matrix',
  OBJECT_COLLECTION: 'collection of objects',
  VISUALIZATION_PREFERENCE: 'visualization preference',
  VISUALIZATION_RENDERING: 'rendered visualization'
};



export class Output{

  name: string;
  cardinality: number=1;
  type: string;


}
