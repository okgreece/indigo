import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {Cube} from "../models/cube";
import {AggregateRequest} from "../models/aggregate/aggregateRequest";

@Injectable()
export class RudolfCubesService {
  private API_PATH: string = 'http://ws307.math.auth.gr/rudolf/public/api/v3/cubes';

  constructor(private http: Http) {}

  searchCubes(queryTitle: string): Observable<Cube[]> {
    return this.http.get(`${this.API_PATH}`)
      .map(res => res.json().data);
  }

  retrieveCube(name: string): Observable<Cube> {
    return this.http.get(`${this.API_PATH}/${name}/model`)
      .map(res => res.json());
  }

  aggregate(element:AggregateRequest): Observable<Cube> {
    ///
    // http://ws307.math.auth.gr/rudolf/public/api/3/cubes/budget-thessaloniki-expenditure-2012__1ef74/aggregate?
    // drilldown=administrativeClassification.notation|administrativeClassification.prefLabel&pagesize=30&order=amount.sum:desc

    let drilldownString =  element.drilldowns.map(d => d.column).join('|');
    let orderString = element.sorts.map(s=>s.column+':'+s.direction).join('|');
    let cutString = element.cuts.map(c=>c.column+":"+c.value).join('|');


   // return this.http.get(`${this.API_PATH}/${element.cube.name}/aggregate?drilldown=administrativeClassification.notation|administrativeClassification.prefLabel&pagesize=30&order=amount.sum:desc`)
    return this.http.get(`${this.API_PATH}/${element.cube.name}/aggregate?drilldown=${drilldownString}&pagesize=${element.pageSize}&order=${orderString}`)
      .map(res => {
        return res.json();})
      ;
  }
}
