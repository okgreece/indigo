import {Sort} from "../sort";
import {Aggregate} from "../aggregate";
import {Drilldown} from "../drilldown";
import {Cut} from "../cut";
import {Cube} from "../cube";
import {AggregateParam} from "../aggregateParam";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class AggregateRequest{

  sorts: Sort[] = [];
  aggregates: AggregateParam[] = [];
  drilldowns: Drilldown[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize :number= 30;
  page : number= 0;


}
