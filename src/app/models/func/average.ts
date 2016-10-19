import { Func} from "./func";
import * as _ from 'lodash';
import {product} from '../../lib/permutations';
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class Average extends Func{
  invoke(inputs:any[]) {

    let drilldowns = _.intersection.apply(_,inputs.map(function (aggregate) { return aggregate.attributes; }));
    let aggregates = _.intersection.apply(_,inputs.map(function (aggregate) { return aggregate.aggregates; }));

    let results = [];


    _.forEach(inputs, function (input) {
        _.forEach(input.cells, function (cell) {

          let index = _.pick(cell, drilldowns);

          let indexPairs = _.toPairs(index);

          let already = _.find(results, function (result) {
            return _.every(indexPairs, function (indexPair) {
              return result[indexPair[0]] == indexPair[1];
            });
          });

          if(already==undefined){
            already = index;
            results.push(already);
          }

          _.forEach(aggregates, function (aggregate) {
            if(!already[aggregate]) {
              already[aggregate] = cell[aggregate];
            }
            else{
              already[aggregate] ^= cell[aggregate];
            }
          });

        })
    });


    let value = {
      cells:results,
      aggregates: aggregates,
      attributes:drilldowns
    };




    return value;
  }

  public get label(){
    return "Average";
  }



}
