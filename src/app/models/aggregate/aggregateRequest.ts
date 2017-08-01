import {Sort} from '../sort';
import {Aggregate} from '../aggregate';
import {Drilldown} from '../drilldown';
import {Cut} from '../cut';
import {Cube} from '../cube';
import {AggregateParam} from '../aggregateParam';
import {Serializable} from '../iserializeable';
import {ApiRequest} from '../apiRequest';
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class AggregateRequest extends ApiRequest implements Serializable<AggregateRequest> {


  sorts: Sort[] = [];
  aggregates: AggregateParam[] = [];
  drilldowns: Drilldown[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize= 30;
  page= 0;

  serialize(input: AggregateRequest): Object {
    return undefined;
  }

  deserialize(input: any): AggregateRequest {

    const sorts = [];

    const aggregates = [];

    const drilldowns = [];

    const cuts = [];



    for (const sort of input.sorts){
      sorts.push(new Sort().deserialize(sort));
    }
    this.sorts = sorts;


    for (const aggregate of input.aggregates){
      aggregates.push(new AggregateParam().deserialize(aggregate));
    }
    this.aggregates = aggregates;


    for (const drilldown of input.drilldowns){
      drilldowns.push(new Drilldown().deserialize(drilldown));
    }
    this.drilldowns = drilldowns;



    for (const cut of input.cuts){
      cuts.push(new Cut().deserialize(cut));
    }
    this.cuts = cuts;


    this.cube = new Cube().deserialize(input.cube);
    this.pageSize = input.pageSize;
    this.page = input.page;


    return this;
  }

  public get actual_aggregates(){
    return Array.from(this.cube.model.aggregates.values());
  }
  public get actual_attributes(){
    if (this.drilldowns.length > 0) {
      return this.drilldowns.map(function (drilldown) {
        return drilldown.column;
      });
    } else {
      return [];
    }
  }

}
