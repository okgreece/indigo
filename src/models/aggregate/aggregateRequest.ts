import {Sort} from "../sort";
import {Aggregate} from "../aggregate";
import {Drilldown} from "../drilldown";
import {Cut} from "../cut";
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class AggregateRequest{

  sorts: Sort[] = [];
  aggregates: Aggregate[] = [];
  drilldowns: Drilldown[] = [];
  cuts: Cut[] = [];

  execute(){

  }
}
