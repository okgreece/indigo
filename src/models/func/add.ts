import { Func} from "./func";
import * as _ from 'lodash';
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Add extends Func{
  invoke(input:any[]) {

    let drilldowns = _.intersection.apply(_,input.map(function (aggregate) { return aggregate.attributes; }));
    let aggregates = _.intersection.apply(_,input.map(function (aggregate) { return aggregate.aggregates; }));


    let values = _.zipObject(drilldowns,_.map(drilldowns,
      function(drilldown){
        return _.intersection.apply(_,_.map(input,
          function(input){return _.map(input.cells,
            function(cell){return cell[drilldown]
          })
        }))
    }));



    debugger;

  }

  public get name(){
    return "Addition";
  }



}
