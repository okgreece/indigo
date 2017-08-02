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
import {ApiRequest} from '../apiRequest';
import {isArray} from 'util';
import * as _ from 'lodash';
/**
 * Created by larjo on 13/10/2016.
 */
export class AnalysisCall {

  public inputs: any = {};
  public outputs: any = {};

  private API_PATH: string = environment.apiUrl + '/api/' + environment.versionSuffix + '/cubes';
  private static breakDownQueryParamParts(queryParam, separator: string = '|') {
    return queryParam.split(separator);
  }

  public constructor(public config: ExecutionConfiguration, public cube: Cube) {

    this.initialize();


  }

  public get query() {
    return this.parametrizeInputs().toString();
  }

  public get valid(): boolean {
    let isValid = true;
    const that = this;
    this.config.inputs.forEach((input) => {
      isValid =
        isValid && ((input.required && !!that.inputs[input.name] && ((input.cardinality !== '1' && that.inputs[input.name].length > 0 ) || input.cardinality === '1'))
        || (input.required && input.guess) || (!input.required));
      if (input.type === InputTypes.BABBAGE_AGGREGATE_URI) {
        isValid = isValid && ((<AggregateRequest> that.inputs[input.name]).drilldowns.length > 0);
      }

    });
    return isValid;
  }


  aggregateToURI(aggregateRequest: AggregateRequest) {
    const drilldownString = aggregateRequest.drilldowns.map(d => d.column.ref).join('|');
    const orderString = aggregateRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join(',');
    const cutString = aggregateRequest.cuts.map(c => {
      return c.column.ref + c.transitivity.key + ':' + c.value;
    }).join('|');
    const aggregatesString = aggregateRequest.aggregates.map(a => a.column.ref).join('|');

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
    if (aggregateRequest.pageSize > 0) {
      params.set('pagesize', aggregateRequest.pageSize.toString());
    }
    if (aggregateRequest.page > 0) {
      params.set('page', aggregateRequest.page.toString());
    }
    return `${this.API_PATH}/${aggregateRequest.cube.name}/aggregate?${params.toString()}`;
  }

  factsToURI(factRequest: FactRequest) {
    const orderString = factRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join(',');
    const cutString = factRequest.cuts.map(c => {
      return c.column.ref + c.transitivity.key + ':' + c.value;
    }).join('|');
    const fieldsString = factRequest.fields.map(f => f.ref ).join(',');

    const params = new URLSearchParams();
    if (factRequest.cuts.length > 0) {
      params.set('cut', cutString);
    }
    if (factRequest.sorts.length > 0) {
      params.set('order', orderString);
    }

    if (factRequest.fields.length > 0) {
      params.set('fields', fieldsString);
    }
    if (factRequest.pageSize > 0) {
      params.set('pagesize', factRequest.pageSize.toString());
    }
    if (factRequest.page > 0) {
      params.set('page', factRequest.page.toString());
    }
    return `${this.API_PATH}/${factRequest.cube.name}/facts?${params.toString()}`;
  }

  public initialize() {
    const that = this;

    this.config.inputs.forEach((input) => {
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            that.inputs[input.name] = input.default_value ? input.default_value : 0;

          } else if (input.data_type === 'float' || input.data_type === 'double') {
            that.inputs[input.name] = input.default_value ? input.default_value : 0;
          } else {
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

    this.configureBoundInputs();
  }

  queryParams() {
    const map = {};
    this.parametrizeInputs().paramsMap.forEach((value: string[], key: string) => {
      map[key] = value[0];
    });

    return map;
  }

  public parametrizeInputs() {
    const parts: URLSearchParams = new URLSearchParams();
    const that = this;

    this.config.inputs.forEach((input) => {
      if (!that.inputs[input.name]) {
        return;
      }
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            parts.append(input.name, parseInt(that.inputs[input.name], 10).toString());

          } else if (input.data_type === 'float' || input.data_type === 'double') {
            parts.append(input.name, parseFloat(that.inputs[input.name]).toString());

          } else {
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
          const uri = this.aggregateToURI(that.inputs[input.name]);
          if (validURL.isUri(uri)) {
            parts.append(input.name, uri);
          }
          break;
        }
        case  InputTypes.BABBAGE_FACT_URI: {
          const uri = this.factsToURI(that.inputs[input.name]);
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

  public deParametrizeInputs(parts: any) {

    const that = this;
    this.config.inputs.forEach((input) => {
      if (!parts[input.name]) {
        return;
      }
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            that.inputs[input.name] = parseInt(parts[input.name], 10);
          } else if (input.data_type === 'float' || input.data_type === 'double') {
            that.inputs[input.name] = parseFloat(parts[input.name]);
          } else {
            that.inputs[input.name] = parts[input.name];
          }
          break;
        }
        case InputTypes.AGGREGATE_REF: {
          const inps = parts[input.name].split('|');
          that.inputs[input.name] =  Array.from(that.cube.model.aggregates.values()).filter(a => inps.includes(a.ref));
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          const inps = parts[input.name].split('|');
          that.inputs[input.name] = Array.from(that.cube.model.attributes.values()).filter(a =>  inps.includes(a.ref));
          break;
        }
        case InputTypes.MEASURE_REF: {
          const inps = parts[input.name].split('|');
          that.inputs[input.name] = Array.from(that.cube.model.measures.values()).filter(a => inps.includes(a.ref));
          break;
        }
        case InputTypes.BABBAGE_AGGREGATE_URI: {
          const uri = parts[input.name];
          if (validURL.isUri(uri)) {
            that.inputs[input.name] = this.aggregateFromURI(uri);
          }
          break;
        }
        case  InputTypes.BABBAGE_FACT_URI: {
          const uri = parts[input.name];
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

    this.configureBoundInputs();

    return parts;
  }

  private aggregateFromURI(uri: string) {
    const parts = new URI(uri).search(true);
    const request = new AggregateRequest();

    request.cube = this.cube;


    if (parts['aggregates']) {
      const aggregates = AnalysisCall.breakDownQueryParamParts(parts['aggregates']);
      request.aggregates = aggregates.map(aggregate => {
        const agg = new AggregateParam();
        agg.column = this.cube.model.aggregates.get(aggregate);
        return agg;
      });

    }
    if (parts['cut']) {
      const that = this;
      const cuts = AnalysisCall.breakDownQueryParamParts(parts['cut']);
      request.cuts = cuts.map(cutSet => {
        const cutParts = cutSet.split(':');
        const cut = new Cut();
        cut.column = that.cube.model.attributes.get(cutParts[0]);
        cut.value = cutParts[1];
        return cut;
      });

    }
    if (parts['order']) {
      const orders = AnalysisCall.breakDownQueryParamParts(parts['order'], ',');
      request.sorts = orders.map(sortSet => {
        const sort = new Sort();
        const sortParts = sortSet.split(':');
        sort.column = this.cube.model.attributes.get(sortParts[0]);
        sort.direction = SortDirection.parse(sortParts[1]);
        return sort;
      });
    }
    if (parts['drilldown']) {
      const drilldowns = AnalysisCall.breakDownQueryParamParts(parts['drilldown']);
      request.drilldowns = drilldowns.map(attribute => {
        const drilldown = new Drilldown;
        drilldown.column = this.cube.model.attributes.get(attribute);
        return drilldown;
      });

    }

    if (parts['pagesize']) {
      request.pageSize = parseInt(parts['pagesize'], 10);
    }
    if (parts['page']) {
      request.page = parseInt(parts['page'], 10);
    }

    return request;


  }

  private factsFromURI(uri: string) {

    const parts = new URI(uri).search(true);
    const request = new FactRequest();

    request.cube = this.cube;

    if (parts['cut']) {
      const that = this;
      const cuts = AnalysisCall.breakDownQueryParamParts(parts['cut']);
      request.cuts = cuts.map(cutSet => {
        const cutParts = cutSet.split(':');
        const cut = new Cut();
        cut.column = that.cube.model.attributes.get(cutParts[0]);
        cut.value = cutParts[1];
        return cut;
      });

    }

    if (parts['fields']) {
      const that = this;
      const fields = AnalysisCall.breakDownQueryParamParts(parts['fields'], ',');
      request.fields = fields.map(field => {
        if (that.cube.model.attributes.has(field)) {
          return that.cube.model.attributes.get(field);
        } else {
          return that.cube.model.measures.get(field);
        }
      });

    }


    if (parts['order']) {
      const orders = AnalysisCall.breakDownQueryParamParts(parts['order'], ',');
      request.sorts = orders.map(sortSet => {
        const sort = new Sort();
        const sortParts = sortSet.split(':');
        sort.column = this.cube.model.attributes.get(sortParts[0]);
        sort.direction = SortDirection.parse(sortParts[1]);
        return sort;
      });
    }
    if (parts['pagesize']) {
      request.pageSize = parseInt(parts['pagesize'], 10);
    }
    if (parts['page']) {
      request.page = parseInt(parts['page'], 10);
    }
    return request;


  }



  private configureBoundInputs() {



    const boundInputNames = Array.from(this.config.inputs.values()).filter(input => input.bound).map(input => input.bound);

    const boundInputs = _.pick(this.inputs, boundInputNames);
    const that = this;

    _.forOwn(boundInputs, function (inputValue: ApiRequest, key: string) {
      const inputs = Array.from(that.config.inputs.values()).filter(input => input.bound && input.bound === key);

      inputValue.actual_attributes_change.subscribe(function () {
        inputs.filter(input => input.type === InputTypes.ATTRIBUTE_REF).forEach(function (bindingInput) {
          const bindingInputVal = that.inputs[bindingInput.name];
          if (bindingInput.cardinality !== '1') {
            const difference = _.differenceWith(bindingInputVal, inputValue.actual_attributes, function (x: Attribute, y: Attribute) {
              return x.ref === y.ref;
            });
            _.pullAll(bindingInputVal, difference);
          } else {
            if (bindingInputVal === null) {
              return;
            }
            const difference = _.differenceWith([bindingInputVal], inputValue.actual_attributes, function (x: Attribute, y: Attribute) {
              return x.ref === y.ref;
            });
            if (difference.length > 0) {
              delete that.inputs[bindingInputVal.name];
            }
          }
        })

      });

      if (inputValue instanceof FactRequest) {

        inputValue.actual_measures_change.subscribe(function () {
          inputs.filter(input => input.type === InputTypes.MEASURE_REF).forEach(function (bindingInput) {
            const bindingInputVal = that.inputs[bindingInput.name];
            if (bindingInput.cardinality !== '1') {
              const difference = _.differenceWith(bindingInputVal, inputValue.actual_measures, function (x: Measure, y: Measure) {
                return x.ref === y.ref;
              });
              _.pullAll(bindingInputVal, difference);
            } else {
              if (bindingInputVal === null) {
                return;
              }
              const difference = _.differenceWith([bindingInputVal], inputValue.actual_measures, function (x: Measure, y: Measure) {
                return x.ref === y.ref;
              });
              if (difference.length > 0) {
                delete that.inputs[bindingInputVal.name];
              }
            }
          })

        });

      }

      if (inputValue instanceof AggregateRequest) {
        inputValue.actual_aggregates_change.subscribe(function () {
          inputs.filter(input => input.type === InputTypes.AGGREGATE_REF).forEach(function (bindingInput) {
            const bindingInputVal = that.inputs[bindingInput.name];
            if (bindingInput.cardinality !== '1') {
              const difference = _.differenceWith(bindingInputVal, inputValue.actual_aggregates, function (x: Aggregate, y: Aggregate) {
                return x.ref === y.ref;
              });
              _.pullAll(bindingInputVal, difference);
            } else {
              if (bindingInputVal === null) {
                return;
              }
              const difference = _.differenceWith([bindingInputVal], inputValue.actual_aggregates, function (x: Aggregate, y: Aggregate) {
                return x.ref === y.ref;
              });
              if (difference.length > 0) {
                delete that.inputs[bindingInputVal.name];
              }
            }
          })

        });
      }






    });


  }



}
