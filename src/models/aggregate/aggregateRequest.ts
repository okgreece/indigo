import {Sort} from "../sort";
import {Aggregate} from "../aggregate";
import {Drilldown} from "../drilldown";
import {Cut} from "../cut";
import {Cube} from "../cube";
import {AggregateParam} from "../aggregateParam";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class AggregateRequest implements Serializable<AggregateRequest>{

  sorts: Sort[] = [];
  aggregates: AggregateParam[] = [];
  drilldowns: Drilldown[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize :number= 30;
  page : number= 0;



  deserialize(input:Object):AggregateRequest {

    let sorts = [];

    let aggregates = [];

    let drilldowns = [];

    let cuts = [];



    for(var sort of input.sorts){
      sorts.push(new Sort().deserialize(sort))
    }
    this.sorts = sorts;


    for(var aggregate of input.aggregates){
      sorts.push(new AggregateParam().deserialize(aggregate))
    }
    this.aggregates = aggregates;


    for(var drilldown of input.drilldowns){
      drilldowns.push(new Drilldown().deserialize(drilldown))
    }
    this.drilldowns = drilldowns;



    for(var cut of input.cuts){
      cuts.push(new Cut().deserialize(cut))
    }
    this.cuts = cuts;


    this.cube = new Cube().deserialize(input.cube);
    this.pageSize = input.pageSize;
    this.page = input.page;


    return this;
  }


}
