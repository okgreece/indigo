import {Cube} from '../cube';
import {Aggregate} from '../aggregate';
import {Attribute} from '../attribute';
import {Measure} from '../measure';
import * as validURL from 'valid-url';
import {InputTypes} from './input';
import {URLSearchParams} from '@angular/http';
import * as URI from 'urijs';
import {environment} from '../../../environments/environment';
import {AggregateRequest} from '../aggregate/aggregateRequest';
import {Cut} from '../cut';
import {AggregateParam} from '../aggregateParam';
import {Sort} from '../sort';
import {Drilldown} from '../drilldown';
import {FactRequest} from '../fact/factRequest';
import {SortDirection} from '../sortDirection';
import {ExecutionConfiguration} from './executionConfiguration';
/**
 * Created by larjo on 13/10/2016.
 */
export class AnalysisCall {

  public inputs: any = {};
  public outputs: any = {};

  private API_PATH: string = environment.apiUrl + '/api/' + environment.versionSuffix + '/cubes';

  aggregateToURI(aggregateRequest: AggregateRequest) {
    let drilldownString = aggregateRequest.drilldowns.map(d => d.column.ref).join('|');
    let orderString = aggregateRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join('|');
    let cutString = aggregateRequest.cuts.map(c => {
      return c.column.ref + c.transitivity.key + ':' + c.value;
    }).join('|');
    let aggregatesString = aggregateRequest.aggregates.map(a => a.column.ref).join('|');

    let params = new URLSearchParams();
    if (aggregateRequest.drilldowns.length > 0) params.set('drilldown', drilldownString);
    if (aggregateRequest.cuts.length > 0) params.set('cut', cutString);
    if (aggregateRequest.sorts.length > 0) params.set('order', orderString);
    if (aggregateRequest.aggregates.length > 0) params.set('aggregates', aggregatesString);
    if (aggregateRequest.pageSize > 0) params.set('pagesize', aggregateRequest.pageSize.toString());
    if (aggregateRequest.page > 0) params.set('page', aggregateRequest.page.toString());
    return `${this.API_PATH}/${aggregateRequest.cube.name}/aggregate?${params.toString()}`;
  }

  factsToURI(factRequest: FactRequest) {
    let orderString = factRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join('|');
    let cutString = factRequest.cuts.map(c => {
      return c.column.ref + c.transitivity.key + ':' + c.value;
    }).join('|');

    let params = new URLSearchParams();
    if (factRequest.cuts.length > 0) params.set('cut', cutString);
    if (factRequest.sorts.length > 0) params.set('order', orderString);
    if (factRequest.pageSize > 0) params.set('pagesize', factRequest.pageSize.toString());
    if (factRequest.page > 0) params.set('page', factRequest.page.toString());
    return `${this.API_PATH}/${factRequest.cube.name}/facts?${params.toString()}`;
  }

  public constructor(public config: ExecutionConfiguration, public cube: Cube) {

    this.initialize();


  }

  public initialize() {
    let that = this;

    this.config.inputs.forEach((input) => {
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            that.inputs[input.name] = input.default_value ? input.default_value : 0;

          }
          else if (input.data_type === 'float' || input.data_type === 'double') {
            that.inputs[input.name] = input.default_value ? input.default_value : 0;
          }
          else {
            that.inputs[input.name] = input.default_value ? input.default_value : '';
          }
          break;
        }
        case InputTypes.AGGREGATE_REF: {
          that.inputs[input.name] = null;
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          that.inputs[input.name] = null;
          break;
        }
        case InputTypes.MEASURE_REF: {
          that.inputs[input.name] = null;
          break;
        }
        case InputTypes.BABBAGE_AGGREGATE_URI: {
          that.inputs[input.name] = new AggregateRequest();
          that.inputs[input.name].cube = that.cube;
          break;
        }
        case  InputTypes.BABBAGE_FACT_URI: {
          that.inputs[input.name] = new FactRequest();
          that.inputs[input.name].cube = that.cube;
          break;
        }
        case InputTypes.RAW_DATA_URI:
        case InputTypes.RAW_DATA:
        case InputTypes.BABBAGE_FACT_RAW_DATA:
        case InputTypes.BABBAGE_AGGREGATE_RAW_DATA:
        default : {
          that.inputs[input.name] = {};
          break;
        }


      }

    });

  }


  public get query() {
    return this.parametrizeInputs().toString();
  }

  queryParams() {
    let map = {};
    this.parametrizeInputs().paramsMap.forEach((value: string[], key: string) => {
      map[key] = value[0];
    });

    return map;
  }


  public parametrizeInputs() {
    let parts: URLSearchParams = new URLSearchParams();
    let that = this;

    this.config.inputs.forEach((input) => {
      if (!that.inputs[input.name])return;
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            parts.append(input.name, parseInt(that.inputs[input.name]).toString());

          }
          else if (input.data_type === 'float' || input.data_type === 'double') {
            parts.append(input.name, parseFloat(that.inputs[input.name]).toString());

          }
          else {
            parts.append(input.name, that.inputs[input.name].toString());

          }
          break;
        }
        case InputTypes.AGGREGATE_REF: {
          if (that.inputs[input.name] instanceof Aggregate) {
            parts.append(input.name, that.inputs[input.name].ref);
          }
          if (Array.isArray(that.inputs[input.name])) {
            parts.append(input.name, that.inputs[input.name].map(function (inp) {
              return inp.ref;
            }).join('|'));
          }
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          if (that.inputs[input.name] instanceof Attribute) {
            parts.append(input.name, that.inputs[input.name].ref);
          }
          if (Array.isArray(that.inputs[input.name])) {
            parts.append(input.name, that.inputs[input.name].map(function (inp) {
              return inp.ref;
            }).join('|'));
          }
          break;

        }
        case InputTypes.BABBAGE_AGGREGATE_URI: {
          let uri = this.aggregateToURI(that.inputs[input.name]);
          if (validURL.isUri(uri)) {
            parts.append(input.name, uri);
          }
          break;
        }
        case  InputTypes.BABBAGE_FACT_URI: {
          let uri = this.factsToURI(that.inputs[input.name]);
          if (validURL.isUri(uri)) {
            parts.append(input.name, uri);
          }
          break;
        }
        case InputTypes.RAW_DATA_URI: {
          if (validURL.isUri(that.inputs[input.name])) {
            parts.append(input.name, that.inputs[input.name]);
          }
          break;
        }
        case InputTypes.MEASURE_REF: {
          if (that.inputs[input.name] instanceof Measure) {
            parts.append(input.name, that.inputs[input.name].ref);
          }
          if (Array.isArray(that.inputs[input.name])) {
            parts.append(input.name, that.inputs[input.name].map(function (inp) {
              return inp.ref;
            }).join('|'));
          }
          break;
        }
        case InputTypes.RAW_DATA:
        case InputTypes.BABBAGE_FACT_RAW_DATA:
        case InputTypes.BABBAGE_AGGREGATE_RAW_DATA:
        default : {
          parts.append(input.name, that.inputs[input.name].toString());
          break;
        }


      }

    });
    return parts;

  }

  public get valid(): boolean {
    let isValid: boolean = true;
    let that = this;
    this.config.inputs.forEach((input) => {
      isValid = isValid && ((input.required && !!that.inputs[input.name]) || (input.required && input.guess) || (!input.required));
      if (input.type === InputTypes.BABBAGE_AGGREGATE_URI) {
        isValid = isValid && ((<AggregateRequest> that.inputs[input.name]).drilldowns.length > 0);
      }

    });
    return isValid;
  }

  public deParametrizeInputs(parts: any) {

    const that = this;
    this.config.inputs.forEach((input) => {
      if (!parts[input.name]){
        return;
      }
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            that.inputs[input.name] = parseInt(parts[input.name]);
          } else if (input.data_type === 'float' || input.data_type === 'double') {
            that.inputs[input.name] = parseFloat(parts[input.name]);
          } else {
            that.inputs[input.name] = parts[input.name];
          }
          break;
        }
        case InputTypes.AGGREGATE_REF: {
          let inps = parts[input.name].split('|');
          that.inputs[input.name] =  Array.from(that.cube.model.aggregates.values()).filter(a => inps.includes(a.ref));
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          let inps = parts[input.name].split('|');
          that.inputs[input.name] = Array.from(that.cube.model.attributes.values()).filter(a =>  inps.includes(a.ref));
          break;
        }
        case InputTypes.MEASURE_REF: {
          let inps = parts[input.name].split('|');
          that.inputs[input.name] = Array.from(that.cube.model.measures.values()).filter(a => inps.includes(a.ref));
          break;
        }
        case InputTypes.BABBAGE_AGGREGATE_URI: {
          let uri = parts[input.name];
          if (validURL.isUri(uri)) {
            that.inputs[input.name] = this.aggregateFromURI(uri);
          }
          break;
        }
        case  InputTypes.BABBAGE_FACT_URI: {
          let uri = parts[input.name];
          if (validURL.isUri(uri)) {
            that.inputs[input.name] = this.factsFromURI(uri);
          }
          break;
        }
        case InputTypes.RAW_DATA_URI:
        case InputTypes.RAW_DATA:
        case InputTypes.BABBAGE_FACT_RAW_DATA:
        case InputTypes.BABBAGE_AGGREGATE_RAW_DATA:
        default : {
          that.inputs[input.name] = parts[input.name];
          break;
        }
      }
    });
    return parts;
  }


  private aggregateFromURI(uri: string) {
    const parts = new URI(uri).search(true);
    const request = new AggregateRequest();

    request.cube = this.cube;


    if (parts['aggregates']) {
      let aggregates = AnalysisCall.breakDownQueryParamParts(parts['aggregates']);
      request.aggregates = aggregates.map(aggregate => {
        let agg = new AggregateParam();
        agg.column = this.cube.model.aggregates.get(aggregate);
        return agg;
      });

    }
    if (parts['cut']) {
      let that = this;
      let cuts = AnalysisCall.breakDownQueryParamParts(parts['cut']);
      request.cuts = cuts.map(cutSet => {
        let cutParts = cutSet.split(':');
        let cut = new Cut();
        cut.column = that.cube.model.attributes.get(cutParts[0]);
        cut.value = cutParts[1];
        return cut;
      });

    }
    if (parts['order']) {
      let orders = AnalysisCall.breakDownQueryParamParts(parts['order']);
      request.sorts = orders.map(sortSet => {
        let sort = new Sort();
        let sortParts = sortSet.split(':');
        sort.column = this.cube.model.attributes.get(sortParts[0]);
        sort.direction = SortDirection.parse(sortParts[1]);
        return sort;
      });
    }
    if (parts['drilldown']) {
      let drilldowns = AnalysisCall.breakDownQueryParamParts(parts['drilldown']);
      request.drilldowns = drilldowns.map(attribute => {
        let drilldown = new Drilldown;
        drilldown.column = this.cube.model.attributes.get(attribute);
        return drilldown;
      });

    }

    if (parts['pagesize']) {
      request.pageSize = parseInt(parts['pagesize']);
    }
    if (parts['page']) {
      request.page = parseInt(parts['page']);
    }

    return request;


  }

  private factsFromURI(uri: string) {

    let parts = new URI(uri).search(true);
    let request = new FactRequest();

    request.cube = this.cube;

    if (parts['cut']) {
      let that = this;
      let cuts = AnalysisCall.breakDownQueryParamParts(parts['cut']);
      request.cuts = cuts.map(cutSet => {
        let cutParts = cutSet.split(':');
        let cut = new Cut();
        cut.column = that.cube.model.attributes.get(cutParts[0]);
        cut.value = cutParts[1];
        return cut;
      });

    }
    if (parts['order']) {
      let orders = AnalysisCall.breakDownQueryParamParts(parts['order']);
      request.sorts = orders.map(sortSet => {
        let sort = new Sort();
        let sortParts = sortSet.split(':');
        sort.column = this.cube.model.attributes.get(sortParts[0]);
        sort.direction = SortDirection.parse(sortParts[1]);
        return sort;
      });
    }
    if (parts['pagesize']) {
      request.pageSize = parseInt(parts['pagesize']);
    }
    if (parts['page']) {
      request.page = parseInt(parts['page']);
    }
    return request;


  }

  private static breakDownQueryParamParts(queryParam) {
    return queryParam.split('|');
  }
}
