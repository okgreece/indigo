import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {Cube} from "../models/cube";

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

  aggregate(name: string): Observable<Cube> {
    ///
    // http://ws307.math.auth.gr/rudolf/public/api/3/cubes/budget-thessaloniki-expenditure-2012__1ef74/aggregate?
    // drilldown=administrativeClassification.notation|administrativeClassification.prefLabel&pagesize=30&order=amount.sum:desc
    return this.http.get(`${this.API_PATH}/${name}/aggregate?drilldown=administrativeClassification.notation|administrativeClassification.prefLabel&pagesize=30&order=amount.sum:desc`)
      .map(res => {
        return res.json();})
      ;
  }
}
