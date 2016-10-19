import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from "../models/cube";
import {AggregateRequest} from "../models/aggregate/aggregateRequest";
import {Dimension} from "../models/dimension";
import 'rxjs/add/operator/mergeMap'

@Injectable()
export class RudolfCubesService {
  private API_PATH:string = 'http://localhost/rudolf/public/api/v3/cubes';

  constructor(private http:Http) {
  }

  searchCubes(queryTitle:string):Observable<Cube[]> {
    return this.http.get(`${this.API_PATH}`)
      .map(res => res.json().data)
      ;
  }

  retrieveCube(name:string):Observable<Cube> {
    return this.http.get(`${this.API_PATH}/${name}/model`)
      .map(res => res.json()).flatMap((cube)=>{
        let fullCube = new Cube().deserialize(cube);
        let observables = [];


        fullCube.model.dimensions.forEach((dimension, key) => {
          observables.push(this.loadDimensionMembers(cube, dimension));
        });


        return Observable.forkJoin(observables, function () {
          return cube;
        });
      });
  }

  aggregate(element:AggregateRequest):Observable<Cube> {
    ///
    // http://ws307.math.auth.gr/rudolf/public/api/3/cubes/budget-thessaloniki-expenditure-2012__1ef74/aggregate?
    // drilldown=administrativeClassification.notation|administrativeClassification.prefLabel&pagesize=30&order=amount.sum:desc
    let drilldownString = element.drilldowns.map(d => d.column.ref).join('|');
    let orderString = element.sorts.map(s=>s.column.ref + ':' + s.direction.key).join('|');
    let cutString = element.cuts.map(c=>c.column.ref+c.transitivity.key + ":" + c.value).join('|');
    let aggregatesString =  element.aggregates.map(a=>a.column.ref).join("|");

    return this.http.get(`${this.API_PATH}/${element.cube.name}/aggregate?drilldown=${drilldownString}&pagesize=${element.pageSize}&page=${element.page}&order=${orderString}&cut=${cutString}&aggregates=${aggregatesString}`)
      .map(res => {
        return res.json();
      })
      ;
  }

  _membersCache:Map<string,Map<string,Object>> = new Map<string,Map<string,Object>>();

  members(cube:Cube, dimension:Dimension):Observable<Map<string,Object>> {
    ///
    // http://next.openspending.org/api/3/cubes/1c95cb52b1d32ee8537fafd2fe1a945d%3Adouala2015/members/economic_classification_2
    let that = this;
    if(this._membersCache && this._membersCache.has(`${cube.name}.${dimension.ref}`)){
      return Observable.create(function (observer) {
        observer.next(that._membersCache.get(`${cube.name}.${dimension.ref}`));
      }) ;

    }

    return this.loadDimensionMembers(cube, dimension);


  }

  loadDimensionMembers(cube:Cube, dimension:Dimension){
    return this.http.get(`${this.API_PATH}/${cube.name}/members/${dimension.ref}`)
      .map(res => {

          let data = res.json().data;

          let members = new Map<string, Object>();

          for(var key in data){
            if(data.hasOwnProperty(key))
              members.set(key, data[key]);
          }

          this._membersCache.set(`${cube.name}.${dimension.ref}`, members);

          return members;


        }
      )
      ;
  }


}
