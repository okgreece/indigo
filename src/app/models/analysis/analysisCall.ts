import {Algorithm} from './algorithm';
import {Cube} from '../cube';
import {Aggregate} from '../aggregate';
import {Attribute} from '../attribute';
import {Measure} from '../measure';
import * as validURL from 'valid-url';
import {InputTypes} from './input';
import {URLSearchParams} from "@angular/http";
import {ApiCubesService} from "../../services/api-cubes";
import {Inject} from "@angular/core";
import {environment} from "../../../environments/environment";
import {AggregateRequest} from "../aggregate/aggregateRequest";
/**
 * Created by larjo on 13/10/2016.
 */
export class AnalysisCall {

  public inputs: any = {};
  public outputs: any = {};

  private API_PATH: string = environment.apiUrl+"/api/"+
    environment.versionSuffix +"/cubes";
  aggregateToURI(aggregateRequest: AggregateRequest){
    let drilldownString = aggregateRequest.drilldowns.map(d => d.column.ref).join('|');
    let orderString = aggregateRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join('|');
    let cutString = aggregateRequest.cuts.map(c => c.column.ref + c.transitivity.key + ':' + c.value).join('|');
    let aggregatesString =  aggregateRequest.aggregates.map(a => a.column.ref).join('|');

    let params = new URLSearchParams();
    if (aggregateRequest.drilldowns.length > 0) params.set('drilldown', drilldownString);
    if (aggregateRequest.cuts.length > 0) params.set('cut', cutString);
    if (aggregateRequest.sorts.length > 0) params.set('order', orderString);
    if (aggregateRequest.aggregates.length > 0) params.set('aggregates', aggregatesString);
    return `${this.API_PATH}/${aggregateRequest.cube.name}/aggregate?${params.toString()}`;
  }


  public constructor(public algorithm: Algorithm, public cube: Cube) {

    if (algorithm.inputs.entries()) {
      algorithm.inputs.forEach((value) => {
        this.inputs[value.name] = null;

      });

      this.outputs['json'] = null;
    }


  }


  public get query(){
    return this.parametrizeInputs().toString();
  }

  queryParams(){
    let map = {};
    this.parametrizeInputs().paramsMap.forEach((value: string[], key: string) => {
      map[key] = value;
    });

    return map;
  }


  public parametrizeInputs() {
    let parts: URLSearchParams = new URLSearchParams();
    let that = this;

    this.algorithm.inputs.forEach((input) => {
      if(!that.inputs[input.name])return;
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
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          if (that.inputs[input.name] instanceof Attribute) {
            parts.append(input.name, that.inputs[input.name].ref);
          }
          break;

        }
        case InputTypes.BABBAGE_AGGREGATE_URI:
        case  InputTypes.BABBAGE_FACT_URI: {
          let uri = this.aggregateToURI(that.inputs[input.name]);
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


  public deParametrizeInputs(parts: URLSearchParams) {



    let that = this;

    this.algorithm.inputs.forEach((input) => {
      debugger;
      if (!parts.has(input.name))return;
      switch (input.type) {
        case InputTypes.PARAMETER: {

          if (input.data_type === 'integer' || input.data_type === 'int') {
            that.inputs[input.name] = parseInt(parts.get(input.name));

          }
          else if (input.data_type === 'float' || input.data_type === 'double') {
            that.inputs[input.name] = parseFloat(parts.get(input.name));
          }
          else {
            that.inputs[input.name] = parts.get(input.name);
          }
          break;
        }
        case InputTypes.AGGREGATE_REF: {
          that.inputs[input.name] = Array.from(that.cube.model.aggregates.values()).filter(a => a.ref === parts[input.name])[0];
          break;

        }
        case InputTypes.ATTRIBUTE_REF: {
          that.inputs[input.name] = Array.from(that.cube.model.attributes.values()).filter(a => a.ref === parts[input.name])[0];
          break;
        }
        case InputTypes.MEASURE_REF: {
          that.inputs[input.name] = Array.from(that.cube.model.measures.values()).filter(a => a.ref === parts[input.name])[0];
          break;
        }
        case InputTypes.BABBAGE_AGGREGATE_URI:
        case  InputTypes.BABBAGE_FACT_URI: {
          let uri = parts.get(input.name);
          if (validURL.isUri(uri)) {
            that.inputs[input.name] = this.aggregateFromURI(uri);
          }
          break;
        }
        case InputTypes.RAW_DATA_URI:
        case InputTypes.RAW_DATA:
        case InputTypes.BABBAGE_FACT_RAW_DATA:
        case InputTypes.BABBAGE_AGGREGATE_RAW_DATA:
        default : {
          that.inputs[input.name] = parts.get(input.name);
          break;
        }


      }

    });
    return parts;

  }


  private aggregateFromURI(uri: string) {
    debugger;
/*    let drilldownString = aggregateRequest.drilldowns.map(d => d.column.ref).join('|');
    let orderString = aggregateRequest.sorts.map(s => s.column.ref + ':' + s.direction.key).join('|');
    let cutString = aggregateRequest.cuts.map(c => c.column.ref + c.transitivity.key + ':' + c.value).join('|');
    let aggregatesString =  aggregateRequest.aggregates.map(a => a.column.ref).join('|');

    let params = new URLSearchParams();
    if (aggregateRequest.drilldowns.length > 0) params.set('drilldown', drilldownString);
    if (aggregateRequest.cuts.length > 0) params.set('cut', cutString);
    if (aggregateRequest.sorts.length > 0) params.set('order', orderString);
    if (aggregateRequest.aggregates.length > 0) params.set('aggregates', aggregatesString);
    return `${this.API_PATH}/${aggregateRequest.cube.name}/aggregate?${params.toString()}`;*/
  }
}
