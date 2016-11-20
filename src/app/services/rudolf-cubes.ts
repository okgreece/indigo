import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from "../models/cube";
import {AggregateRequest} from "../models/aggregate/aggregateRequest";
import {Dimension} from "../models/dimension";
import 'rxjs/add/operator/mergeMap'
import { environment } from '../../environments/environment';
import {FactRequest} from "../models/fact/factRequest";

@Injectable()
export class RudolfCubesService {
  private API_PATH:string = environment.apiUrl+"/api/"+
    environment.versionSuffix +"/cubes";
  private API_PACKAGES_PATH:string = environment.apiUrl+"/search/package";
  private API_PACKAGE_PATH:string = environment.apiUrl+"/api/"+environment.versionSuffix+"/info";

  constructor(private http:Http) {
  }

  searchCubes(queryTitle:string):Observable<any[]> {
    return this.http.get(`${this.API_PACKAGES_PATH}`)
      .map(res => res.json())
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

        observables.push(this.retrievePackage(cube));

        return Observable.forkJoin(observables, function () {
          return cube;
        });
      });
  }

  retrievePackage(cube:Cube):Observable<Cube> {
    return this.http.get(`${this.API_PACKAGE_PATH}/${cube.name}/package`)
      .map(res => {

        let pckg = res.json();

        cube.pckg = pckg;

        return pckg;


      });
  }

  fact(element:FactRequest):Observable<Cube> {
    let orderString = element.sorts.map(s=>s.column.ref + ':' + s.direction.key).join('|');
    let cutString = element.cuts.map(c=>c.column.ref+c.transitivity.key + ":" + c.value).join('|');

    let params = new URLSearchParams();
    if(element.cuts.length>0) params.set("cut", cutString);
    if(element.sorts.length>0) params.set("order", orderString);

    return this.http.get(`${this.API_PATH}/${element.cube.name}/facts`, {search:params})
      .map(res => {
        return res.json();
      })
      ;
  }


  aggregate(element:AggregateRequest):Observable<Cube> {
    let drilldownString = element.drilldowns.map(d => d.column.ref).join('|');
    let orderString = element.sorts.map(s=>s.column.ref + ':' + s.direction.key).join('|');
    let cutString = element.cuts.map(c=>c.column.ref+c.transitivity.key + ":" + c.value).join('|');
    let aggregatesString =  element.aggregates.map(a=>a.column.ref).join("|");

    let params = new URLSearchParams();
    if(element.drilldowns.length>0) params.set("drilldown", drilldownString);
    if(element.cuts.length>0) params.set("cut", cutString);
    if(element.sorts.length>0) params.set("order", orderString);
    if(element.aggregates.length>0) params.set("aggregates", aggregatesString);

    return this.http.get(`${this.API_PATH}/${element.cube.name}/aggregate`, {search:params})
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

          for(let key in data){
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
