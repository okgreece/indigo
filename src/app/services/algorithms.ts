import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from '../models/cube';
import 'rxjs/add/operator/mergeMap';
import {Algorithm} from '../models/analysis/algorithm';
import {Input, InputTypes} from '../models/analysis/input';
import {Output, OutputTypes} from '../models/analysis/output';
import {environment} from '../../environments/environment';
import {ExecutionConfiguration} from '../models/analysis/executionConfiguration';
import {Configuration} from 'jasmine-spec-reporter/built/configuration';

@Injectable()
export class AlgorithmsService {
  private API_DAM_PATH: string = environment.DAMUrl ;

  constructor(private http: Http) {
  }


  getActualCompatibleAlgorithms(): Observable<Algorithm[]> {
   // console.log(JSON.stringify({time_series: AlgorithmsService.dummyTimeSeries().serialize(), descriptive_statistics: AlgorithmsService.dummyDescriptiveStatistics().serialize(), clustering:  AlgorithmsService.dummyClustering().serialize()}));

    return this.http.get(`${environment.DAMUrl}/services/meta/all`)
      .map(res => {
        let algorithms = [];
        let response = res.json();
        for (let key of Object.keys(response)){
          let algorithm =  new Algorithm().deserialize(response[key]);

          algorithms.push(algorithm);

        }

        return algorithms;

      });



  }


  getActualCompatibleAlgorithm( algorithmName): Observable<Algorithm> {

    return this.http.get(`${environment.DAMUrl}/services/meta/${algorithmName}`)
      .map(res => {

        let response = res.json();

        return new Algorithm().deserialize(response);
      });


  }


  getTimeSeriesAlgorithm(): Observable<Algorithm> {
    let that = this;
    return this.getActualCompatibleAlgorithm('time_series');


  }
  getDescriptiveStatisticsAlgorithm(): Observable<Algorithm> {
    return this.getActualCompatibleAlgorithm('descriptive_statistics');

  }

  getClusteringAlgorithm(): Observable<Algorithm> {
    return this.getActualCompatibleAlgorithm('clustering');

  }

  getOutlierDetectionAlgorithm(): Observable<Algorithm> {
    let that = this;
    return this.getActualCompatibleAlgorithm('outlier_detection');
    /*return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyOutlierDetection());
    });*/
  }

  getRuleMiningAlgorithm(): Observable<Algorithm> {
    let that = this;
    return this.getActualCompatibleAlgorithm('rule_mining');
    /*return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyOutlierDetection());
    });*/
  }

  getAlgorithm(name, cube: Cube): Observable<Algorithm> {
    switch (name) {
      case 'time_series':
        return this.getTimeSeriesAlgorithm();
      case 'descriptive_statistics':
        return this.getDescriptiveStatisticsAlgorithm();
      case 'clustering':
        return this.getClusteringAlgorithm();
      case 'outlier_detection':
        return this.getOutlierDetectionAlgorithm();
      case 'rule_mining':
        return this.getRuleMiningAlgorithm();
      default:
        return  this.http.get(`${this.API_DAM_PATH}/${name}`)
        .map(res => {

          let response = res.json();
          return new Algorithm().deserialize(response);
        });


    }

  }







}
