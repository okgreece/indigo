import {Sort} from '../sort';
import {Cut} from '../cut';
import {Cube} from '../cube';
import {Serializable} from '../iserializeable';
import {ApiRequest} from '../apiRequest';
import {Attribute} from '../attribute';
import {Dimension} from '../dimension';
import {GenericProperty} from '../genericProperty';
import {Measure} from '../measure';
import {EventEmitter, Output} from "@angular/core";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class FactRequest extends ApiRequest implements Serializable<FactRequest> {


  sorts: Sort[] = [];
  fields: GenericProperty[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize= null;
  page= 0;

  @Output()
  public actual_measures_change: EventEmitter<any> = new EventEmitter<any>();
  public actual_attributes_change: EventEmitter<any> =  new EventEmitter<any>();

  serialize(input: FactRequest): Object {
    return undefined;
  }

  deserialize(input: any): FactRequest {

    const sorts = [];

    const cuts = [];

    for (const sort of input.sorts){
      sorts.push(new Sort().deserialize(sort));
    }
    this.sorts = sorts;

    for (const cut of input.cuts){
      cuts.push(new Cut().deserialize(cut));
    }
    this.cuts = cuts;



    this.cube = new Cube().deserialize(input.cube);
    this.pageSize = input.pageSize;
    this.page = input.page;

    return this;
  }



  public get actual_measures(){
    if (this.fields.length > 0) {
      return this.fields.filter(field => (field instanceof Measure));
    } else {
      return Array.from(this.cube.model.measures.values());
    }
  }

  public get actual_attributes(){
    if (this.fields.length > 0) {
      return this.fields.filter(field => (field instanceof Attribute));
    } else {
      return Array.from(this.cube.model.dimensions.values()).map(function (dimension: Dimension) {
        return dimension.attributes.get(dimension.label_attribute)});
    }
  }


  public emitFieldChanges() {
    this.actual_attributes_change.emit();
    this.actual_measures_change.emit();

  }
}
