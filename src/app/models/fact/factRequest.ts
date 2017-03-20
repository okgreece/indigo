import {Sort} from '../sort';
import {Cut} from '../cut';
import {Cube} from '../cube';
import {Serializable} from '../iserializeable';
/**
 * Created by larjo_000 on 27/6/2016.
 */
export class FactRequest implements Serializable<FactRequest> {
  serialize(input: FactRequest): Object {
    return undefined;
  }

  sorts: Sort[] = [];
  cuts: Cut[] = [];
  cube: Cube;
  pageSize: number= 30;
  page: number= 0;



  deserialize(input: any): FactRequest {

    let sorts = [];

    let cuts = [];

    for (let sort of input.sorts){
      sorts.push(new Sort().deserialize(sort));
    }
    this.sorts = sorts;




    for (let cut of input.cuts){
      cuts.push(new Cut().deserialize(cut));
    }
    this.cuts = cuts;


    this.cube = new Cube().deserialize(input.cube);
    this.pageSize = input.pageSize;
    this.page = input.page;


    return this;
  }


}
