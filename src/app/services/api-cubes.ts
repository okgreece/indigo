import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from '../models/cube';
import {AggregateRequest} from '../models/aggregate/aggregateRequest';
import {Dimension} from '../models/dimension';
import 'rxjs/add/operator/mergeMap';
import { environment } from '../../environments/environment';
import {FactRequest} from '../models/fact/factRequest';

@Injectable()
export class ApiCubesService {
  private API_PATH: string = environment.apiUrl + '/api/' + environment.versionSuffix + '/cubes';
  private API_PACKAGES_PATH: string = environment.apiUrl + '/search/package';
  private API_PACKAGE_PATH: string = environment.apiUrl + '/api/' + environment.versionSuffix + '/info';
  private _membersCache: Map<string, Map<string, Object>> = new Map<string, Map<string, Object>>();

  constructor(private http: Http) {
  }

  searchCubes(queryTitle: string, size: number, from: number): Observable<any[]> {

    const params = new URLSearchParams();
    params.set('q', `"${queryTitle}"`);
    params.set('size', size.toString());
    params.set('from', from.toString());
    return this.http.get(`${this.API_PACKAGES_PATH}`, {search: params})
      .map(res => res.json())
      ;
  }

  retrieveCube(name: string): Observable<Cube> {
    return this.http.get(`${this.API_PATH}/${name}/model`)
      .map(res => res.json()).flatMap((cube) => {
        const fullCube = new Cube().deserialize(cube);
        const observables = [];


        fullCube.model.dimensions.forEach((dimension) => {
          observables.push(this.loadDimensionMembers(cube, dimension));
        });

        observables.push(this.retrievePackage(cube));

        return Observable.forkJoin(observables, function () {
          return cube;
        });
      });
  }

  retrieveCubeLight(name: string): Observable<Cube> {
    return this.http.get(`${this.API_PATH}/${name}/model`)
      .map(res => res.json()).flatMap((cube) => {
        const observables = [];
         observables.push(this.retrievePackage(cube));

        return Observable.forkJoin(observables, function () {
          return cube;
        });
      });
  }

  retrievePackage(cube: Cube): Observable<Cube> {
    return this.http.get(`${this.API_PACKAGE_PATH}/${cube.name}/package`)
      .map(res => {

        const pckg = res.json();

        cube.pckg = pckg;

        return pckg;


      });
  }

  factToUri(element: FactRequest) {
    const orderString = element.sorts.map(s => s.column.ref + ':' + s.direction.key).join(',');
    const cutString = element.cuts.map(c => c.column.ref + c.transitivity.key + ':' + c.value).join('|');
    const fieldsString = element.fields.map(c => c.ref ).join(',');

    const params = new URLSearchParams();
    if (element.cuts.length > 0) {
      params.set('cut', cutString);
    }
    if (element.sorts.length > 0) {
      params.set('order', orderString);
    }

    if (element.fields.length > 0) {
      params.set('fields', fieldsString);
    }

    if (element.page) {
      params.set('page', element.page.toString());
    }
    if (element.pageSize) {
      params.set('pagesize', element.pageSize.toString());
    }
    return `${this.API_PATH}/${element.cube.name}/facts?${params.toString()}`;


  }

  fact(element: any): Observable<any> {
    let url = '';
    if (element instanceof FactRequest) {
      url = this.factToUri(element);
    } else {
      url = element;
    }

    return this.http.get(url)
      .map(res => {
        return res.json();
      })
      ;
  }

  aggregateToURI(aggregateRequest: AggregateRequest) {
    const drilldownString = aggregateRequest.drilldowns.map(d => d.column.ref).join('|');
    const orderString = aggregateRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join(',');
    const cutString = aggregateRequest.cuts.map(c => c.column.ref + c.transitivity.key + ':' + c.value).join('|');
    const aggregatesString =  aggregateRequest.aggregates.map(a => a.column.ref).join('|');

    const params = new URLSearchParams();
    if (aggregateRequest.drilldowns.length > 0) {
      params.set('drilldown', drilldownString);
    }
    if (aggregateRequest.cuts.length > 0) {
      params.set('cut', cutString);
    }
    if (aggregateRequest.sorts.length > 0) {
      params.set('order', orderString);
    }
    if (aggregateRequest.aggregates.length > 0) {
      params.set('aggregates', aggregatesString);
    }
    if (aggregateRequest.page) {
      params.set('page', aggregateRequest.page.toString());
    }
    if (aggregateRequest.pageSize) {
      params.set('pagesize', aggregateRequest.pageSize.toString());
    }
    return `${this.API_PATH}/${aggregateRequest.cube.name}/aggregate?${params.toString()}`;
  }




  aggregate(element: any): Observable<Cube> {
    let url = '';
    if (element instanceof AggregateRequest) {
      url = this.aggregateToURI(element);
    } else {
      url = element;
    }

    return this.http.get(url)
      .map(res => {
        return res.json();
      })
      ;
  }


  members(cube: Cube, dimension: Dimension): Observable <Map<string, Object>> {
    ///
    // http://next.openspending.org/api/3/cubes/1c95cb52b1d32ee8537fafd2fe1a945d%3Adouala2015/members/economic_classification_2
    const that = this;
    if (this._membersCache && this._membersCache.has(`${cube.name}.${dimension.ref}`)) {
      return Observable.create(function (observer) {
        observer.next(that._membersCache.get(`${cube.name}.${dimension.ref}`));
      }) ;

    }

    return this.loadDimensionMembers(cube, dimension);


  }

  loadDimensionMembers(cube: Cube, dimension: Dimension) {
    return this.http.get(`${this.API_PATH}/${cube.name}/members/${dimension.ref}`)
      .map(res => {

          const data = res.json().data;

          const members = new Map<string, Object>();

          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              members.set(key, data[key]);
            }
          }

          this._membersCache.set(`${cube.name}.${dimension.ref}`, members);

          return members;


        }
      )
      ;
  }


}
