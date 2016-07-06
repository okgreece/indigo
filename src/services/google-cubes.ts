import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {Cube} from "../models/cube";

@Injectable()
export class GoogleCubesService {
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
}
