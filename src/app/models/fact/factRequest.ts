import {Sort} from '../sort';
import {Cut} from '../cut';
import {Cube} from '../cube';
import {Serializable} from '../iserializeable';
import {ApiRequest} from '../apiRequest';
import {Attribute} from '../attribute';
import {Dimension} from "../dimension";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class FactRequest extends ApiRequest implements Serializable<FactRequest> {


  sorts: Sort[] = [];
  fields: Attribute[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize= 30;
  page= 0;

  serialize(input: FactRequest): Object {
    return undefined;
  }

  deserialize(input: any): FactRequest {

    const sorts = [];

    const cuts = [];

    const attributes = [];

    for (const sort of input.sorts){
      sorts.push(new Sort().deserialize(sort));
    }
    this.sorts = sorts;




    for (const cut of input.cuts){
      cuts.push(new Cut().deserialize(cut));
    }
    this.cuts = cuts;



    for (const attribute of input.attributes){
      this.fields.push(new Attribute().deserialize(attribute));
    }
    this.cuts = cuts;


    this.cube = new Cube().deserialize(input.cube);
    this.pageSize = input.pageSize;
    this.page = input.page;


    return this;
  }

  public get actual_measures(){
    return Array.from(this.cube.model.measures.values());
  }

  public get actual_attributes(){
    if (this.fields.length > 0) {
      return this.fields;
    } else {
      return Array.from(this.cube.model.dimensions.values()).map(function (dimension: Dimension) {
        return dimension.attributes.get(dimension.label_attribute)});
    }
  }


}
