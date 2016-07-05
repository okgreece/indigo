import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import {Cube} from "../models/cube";

@Injectable()
export class GoogleCubesService {
  private API_PATH: string = 'https://www.googleapis.com/cubes/v1/volumes';

  constructor(private http: Http) {}

  searchCubes(queryTitle: string): Observable<Cube[]> {
    return this.http.get(`${this.API_PATH}?q=${queryTitle}`)
      .map(res => res.json().items);
  }

  retrieveCube(volumeId: string): Observable<Cube> {
    return this.http.get(`${this.API_PATH}/${volumeId}`)
      .map(res => res.json());
  }
}
