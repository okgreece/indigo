import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Headers, Http, QueryEncoder, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/Subscription';
import {ExecutionConfiguration} from '../models/analysis/executionConfiguration';
import {environment} from '../../environments/environment';
import {JobTimeoutException} from '../models/analysis/jobTimeoutException';
import {Cube} from '../models/cube';
import {TimeoutError} from 'rxjs/Rx';

@Injectable()
export class AnalysisService {

  constructor(private http: Http) {
  }

  execute(configuration: ExecutionConfiguration, inputs, cube: Cube): Observable<any> {


    if (configuration.algorithm.name === 'time_series' || configuration.algorithm.name === 'TimeSeries') {
      return this.timeseries(configuration, inputs);

    } else if (configuration.algorithm.name === 'descriptive_statistics') {
      return this.descriptive(configuration, inputs);
    } else if (configuration.algorithm.name === 'clustering') {
      return this.clustering(configuration, inputs);
    } else if (configuration.algorithm.name === 'outlier_detection') {
      return this.outlier(configuration, inputs, cube);
    } else if (configuration.algorithm.name === 'rule_mining') {
      return this.rulemining(configuration, inputs, cube);
    }


  }

  timeseries(configuration, inputs) {


    const that = this;
    const body = new URLSearchParams();

    body.set('amount', inputs['amount']);
    body.set('time', inputs['time']);
    body.set('prediction_steps', inputs['prediction_steps']);
    body.set('json_data', (inputs['json_data']));

    return that.http.get(configuration.endpoint.toString(), {search: body}).map(res => {
      return res.json();
    }).mergeMap(resp => {


      const headersAdditional = new Headers;
      headersAdditional.append('Cache-control', 'no-cache');
      headersAdditional.append('Cache-control', 'no-store');
      headersAdditional.append('Expires', '0');
      headersAdditional.append('Pragma', 'no-cache');

      return this.http.get(environment.DAMUrl + '/results/' + resp.jobid, {'headers': headersAdditional})
        .map(res => {
          let response = res.json();
          if (!response.hasOwnProperty('result')) {
            throw new Error('ex');

          }

          response = response.result;

          const forecasts = response['forecasts'];
          const values: any = [];
          for (let i = 0; i < forecasts.data_year.length; i++) {
            values.push({
              year: parseInt(forecasts.data_year[i], 10),
              amount: parseFloat(forecasts.data[i])
            });
          }
          for (let i = 0; i < forecasts.predict_time.length; i++) {
            const val: any = {
              year: parseInt(forecasts.predict_time[i], 10),
              amount: parseFloat(forecasts.predict_values[i])

            };


            if (!isNaN(forecasts.up80[i])) {
              val.up80 = parseFloat(forecasts.up80[i]);
            }
            if (!isNaN(forecasts.up95[i])) {
              val.up95 = parseFloat(forecasts.up95[i]);
            }
            if (!isNaN(forecasts.low80[i])) {
              val.low80 = parseFloat(forecasts.low80[i]);
            }
            if (!isNaN(forecasts.low95[i])) {
              val.low95 = parseFloat(forecasts.low95[i]);
            }

            values.push(val);
          }
          const acfRegular = response['acf.param']['acf.parameters'];
          const acfValues = [];

          for (let i = 0; i < acfRegular['acf.lag'].length; i++) {
            acfValues.push({
              lag: parseFloat(acfRegular['acf.lag'][i]),
              correlation: parseFloat(acfRegular['acf'][i])
            });
          }

          const pacfRegular = response['acf.param']['pacf.parameters'];
          const pacfValues = [];

          for (let i = 0; i < pacfRegular['pacf.lag'].length; i++) {
            pacfValues.push({
              lag: parseFloat(pacfRegular['pacf.lag'][i]),
              correlation: parseFloat(pacfRegular['pacf'][i])
            });
          }


          const acfResiduals = response['acf.param']['acf.residuals.parameters'];
          const acfResValues = [];

          for (let i = 0; i < acfResiduals['acf.residuals.lag'].length; i++) {
            acfResValues.push({
              lag: parseFloat(acfResiduals['acf.residuals.lag'][i]),
              correlation: parseFloat(acfResiduals['acf.residuals'][i])
            });
          }

          const pacfResiduals = response['acf.param']['pacf.residuals.parameters'];
          const pacfResValues = [];

          for (let i = 0; i < pacfResiduals['pacf.residuals.lag'].length; i++) {
            pacfResValues.push({
              lag: parseFloat(pacfResiduals['pacf.residuals.lag'][i]),
              correlation: parseFloat(pacfResiduals['pacf.residuals'][i])
            });
          }


          const stl_plot = response.decomposition['stl.plot'];
          const trends: any = [];
          for (let i = 0; i < stl_plot.time.length; i++) {
            const val: any = {
              year: parseInt(stl_plot.time[i], 10),
              amount: parseFloat(stl_plot.trend[i])
            };
            if (stl_plot['conf.interval.low']) {
              if (!isNaN(stl_plot['conf.interval.low'][i])) {
                val.low80 = parseFloat(stl_plot['conf.interval.low'][i]);
              }
            }
            if (stl_plot['conf.interval.up']) {
              if (!isNaN(stl_plot['conf.interval.up'][i])) {
                val.up80 = parseFloat(stl_plot['conf.interval.up'][i]);
              }
            }
            trends.push(val);
          }
          const seasonals: any = [];
          for (let i = 0; i < stl_plot.time.length; i++) {
            const val = {
              year: parseInt(stl_plot.time[i], 10),
              amount: parseFloat(stl_plot.seasonal[i])
            };

            seasonals.push(val);
          }
          const remainders: any = [];
          for (let i = 0; i < stl_plot.time.length; i++) {
            const val = {
              year: parseInt(stl_plot.time[i], 10),
              amount: parseFloat(stl_plot.remainder[i])
            };

            remainders.push(val);
          }


          const stl_general = response.decomposition['stl.general'];
          const compare = response.decomposition['compare'];

          const residuals = response.decomposition['residuals_fitted'];

          const fitted_residuals: any = [];
          for (let i = 0; i < residuals.fitted.length; i++) {
            const val = {
              year: parseFloat(residuals.fitted[i]),
              amount: parseFloat(residuals.residuals[i])
            };

            fitted_residuals.push(val);
          }


          const time_residuals: any = [];
          for (let i = 0; i < residuals.time.length; i++) {
            const val = {
              year: parseFloat(residuals.time[i]),
              amount: parseFloat(residuals.residuals[i])
            };

            time_residuals.push(val);
          }

          const time_fitted: any = [];
          for (let i = 0; i < residuals.time.length; i++) {
            const val = {
              year: parseFloat(residuals.time[i]),
              amount: parseFloat(residuals.fitted[i])
            };

            time_fitted.push(val);
          }


          const model_fitting = response['model.param'].residuals_fitted;
          const model_fitting_compare = response['model.param'].compare;
          const model = response['model.param'].model;

          const model_fitted_residuals: any = [];
          for (let i = 0; i < model_fitting.fitted.length; i++) {
            const val = {
              year: parseFloat(model_fitting.fitted[i]),
              amount: parseFloat(model_fitting.residuals[i])
            };

            model_fitted_residuals.push(val);
          }


          const model_time_residuals: any = [];
          for (let i = 0; i < model_fitting.time.length; i++) {
            const val = {
              year: parseFloat(model_fitting.time[i]),
              amount: parseFloat(model_fitting.residuals[i])
            };

            model_time_residuals.push(val);
          }

          const model_time_fitted: any = [];
          for (let i = 0; i < model_fitting.time.length; i++) {
            const val = {
              year: parseFloat(model_fitting.time[i]),
              amount: parseFloat(model_fitting.fitted[i])
            };

            model_time_fitted.push(val);
          }


          return {
            forecast: {
              values: values, model: forecasts['ts.model'][0]
            },
            autocorrelation: {
              acf: {
                regular: {
                  values: acfValues,
                  interval_up: acfRegular['confidence.interval.up'][0],
                  interval_low: acfRegular['confidence.interval.low'][0]

                },
                residuals: {
                  values: acfResValues,
                  interval_up: acfResiduals['confidence.interval.up'][0],
                  interval_low: acfResiduals['confidence.interval.low'][0]
                },
              },

              pacf: {
                regular: {
                  values: pacfValues,
                  interval_up: pacfRegular['confidence.interval.up'][0],
                  interval_low: pacfRegular['confidence.interval.low'][0]
                },
                residuals: {
                  values: pacfResValues,
                  interval_up: pacfResiduals['confidence.interval.up'][0],
                  interval_low: pacfResiduals['confidence.interval.low'][0]
                }
              }
            },
            decomposition: {
              trends: trends,
              remainders: remainders,
              seasonals: seasonals,
              time_fitted: time_fitted,
              time_residuals: time_residuals,
              fitted_residuals: fitted_residuals,
              general: stl_general,
              compare: compare,
              seasonal: Object.keys(stl_plot.seasonal).length > 0

            },
            fitting: {
              time_fitted: model_time_fitted,
              time_residuals: model_time_residuals,
              fitted_residuals: model_fitted_residuals,
              compare: model_fitting_compare,
              model: model
            }


          }


        }).retryWhen(function (attempts) {
          return Observable.range(1, environment.DAMretries).zip(attempts, function (i) {
            return i;
          }).flatMap(function (i) {
            console.log('delay retry by ' + i + ' second(s)');
            if (i === environment.DAMretries) {
              return Observable.throw(new JobTimeoutException);
            }
            return Observable.timer(i * environment.DAMpollingInitialStep);
          });
        });
    });

  }

  outlier(configuration, inputs, cube) {
    const that = this;
    const body = new URLSearchParams();

    if (configuration.name === 'LOF_AGGREGATE') {
      body.set('BABBAGE_AGGREGATE_URI', inputs['BABBAGE_AGGREGATE_URI']);
    } else {
      body.set('BABBAGE_FACT_URI', inputs['BABBAGE_FACT_URI']);
    }


    return that.http.get(configuration.endpoint.toString(), {search: body}).map(res => {
      return res.json();
    }).mergeMap(resp => {


      const headersAdditional = new Headers;
      headersAdditional.append('Cache-control', 'no-cache');
      headersAdditional.append('Cache-control', 'no-store');
      headersAdditional.append('Expires', '0');
      headersAdditional.append('Pragma', 'no-cache');

      return this.http.get(environment.DAMUrl + '/results/' + resp.jobid, {'headers': headersAdditional})
        .map(res => {
          const response = res.json();

          if (!response.hasOwnProperty('result')) {
            throw new Error('ex');

          }
          if (configuration.name === 'LOF_FACTS' || configuration.name === 'LOF_AGGREGATE') {
            const values: any = response.result.result;
            return {values: values};

          } else {
            const values: any = response.result;
            const new_values = [];
            const mappings = {};

            Object.keys(values[0]).forEach(function (key) {
              mappings[key] = key;
              cube.model.dimensions.forEach(function (dimension) {
                dimension.significants.forEach(function (attribute) {
                  if (key === (dimension.ref + '_' + attribute.shortRef).toLowerCase()) {
                    mappings[key] = attribute.ref;
                  }
                });
              });
              cube.model.measures.forEach(function (measure) {
                if (key === (measure.ref).toLowerCase()) {
                  mappings[key] = 'Target';
                }
              })
            });
            values.forEach(function (value) {
              const new_value = {};
              Object.keys(value).forEach(function (key) {
                new_value[mappings[key]] = value[key];
              });
              new_values.push(new_value);
            });


            return {values: new_values};

          }


        }).retryWhen(function (attempts) {
          return Observable.range(1, environment.DAMretries).zip(attempts, function (i) {
            return i;
          }).flatMap(function (i) {
            console.log('delay retry by ' + i + ' second(s)');
            if (i === environment.DAMretries) {
              return Observable.throw(new JobTimeoutException);
            }
            return Observable.timer(i * environment.DAMpollingInitialStep);
          });
        });
    });


  }

  rulemining(configuration, inputs, cube) {
    const that = this;
    const body = new URLSearchParams();

    body.set('BABBAGE_FACT_URI', inputs['BABBAGE_FACT_URI']);
    body.set('consequentColumns[]', inputs['consequentColumns']);
    body.set('antecedentColumns[]', inputs['antecedentColumns']);
    if (inputs['minConfidence']) {
      body.set('minConfidence', inputs['minConfidence']);
    }
    if (inputs['minSupport']) {
      body.set('minSupport', inputs['minSupport']);
    }


    return that.http.get(configuration.endpoint.toString(), {search: body}).map(res => {
      return res.json();
    }).mergeMap(resp => {

      const headersAdditional = new Headers;
      headersAdditional.append('Cache-control', 'no-cache');
      headersAdditional.append('Cache-control', 'no-store');
      headersAdditional.append('Expires', '0');
      headersAdditional.append('Pragma', 'no-cache');

      return this.http.get(environment.DAMUrl + '/results/' + resp.jobid, {headers: headersAdditional})
        .map(res => {

          const response = res.json();

          if (!response.hasOwnProperty('result')) {
            throw new TimeoutError();

          }
          const data: any = response.result;



          const new_rules = [];

          const regex = /(((.*?)\()(.*)\)|\*) → ((.*?)\()(.*?)(\)|$)/g;

          if (data.rules.length < 1) {
            return data.rules;
          }

            data.rules.forEach(function (rule) {
            const new_rule = rule;
            const str = rule.text;
            let m;

            while ((m = regex.exec(str)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                regex.lastIndex++;
              }


              let antCol;
              let antVal;
              if (m[3]) {
                antCol = m[3];
                antVal = m[4];
              } else {
                antVal = m[1];
              }

              let consCol = m[6];
              const consVal = m[7];

              cube.model.dimensions.forEach(function (dimension) {
                dimension.significants.forEach(function (attribute) {
                  if (antCol === (dimension.ref + '_' + attribute.shortRef).toLowerCase()) {
                    antCol = attribute.ref;
                  }
                });
              });

              cube.model.dimensions.forEach(function (dimension) {
                dimension.significants.forEach(function (attribute) {
                  if (consCol === (dimension.ref + '_' + attribute.shortRef).toLowerCase()) {
                    consCol = attribute.ref;
                  }
                });
              });

              new_rule.antCol = antCol;
              new_rule.antVal = antVal;
              new_rule.consCol = consCol;
              new_rule.consVal = consVal;

              new_rules.push(new_rule);

            }
          });
          data.rules = new_rules;


          return data;

        }).catch((err: any) => {
            if ((err instanceof TimeoutError)) {
              throw err;
            }
            return Observable.of(undefined);


          }
        )
        .retryWhen(function (attempts) {
          return Observable.range(1, environment.DAMretries).zip(attempts, function (i) {
            return i;
          }).flatMap(function (i) {
            console.log('delay retry by ' + i + ' second(s)');
            if (i === environment.DAMretries) {
              return Observable.throw(new JobTimeoutException);
            }
            return Observable.timer(i * environment.DAMpollingInitialStep);
          });
        })

    });


  }

  clustering(configuration, inputs) {
    const that = this;
    const body = new URLSearchParams('', new PureURIEncoder());

    const dimensionColumnString = '\'' + inputs['dimensions'] + '\'';

    body.set('amounts', '\'' + inputs['amounts'] + '\'');
    body.set('dimensions', dimensionColumnString);
    if (inputs['measured.dim']) {
      const measuredDimString = '\'' + inputs['measured.dim'] + '\'';
      body.set('measured.dim', measuredDimString);
    }
    body.set('cl.method', '\'' + inputs['cl.meth'] + '\'');
    body.set('cl.num', '\'' + Number(inputs['cl.num']) + '\'');
    body.set('json_data', '\'' + inputs['json_data'] + '\'');

    return that.http.post(configuration.endpoint.toString() + '/print', body).map(res => {
      return res.json();


    });


  }

  descriptive(configuration, inputs) {
    const that = this;
    const body = new URLSearchParams('', new PureURIEncoder());
    body.set('json_data', '\'' + (inputs['json_data']) + '\'');


    const amountColumnString = '\'' + inputs['amounts'] + '\'';

    const dimensionColumnString = '\'' + inputs['dimensions'] + '\'';

    body.set('amounts', amountColumnString);
    body.set('dimensions', dimensionColumnString);
    // body.set('x', "'" + JSON.stringify(json) + "'");

    return that.http.post(configuration.endpoint.toString() + '/print', body).map(res => {
      const response = res.json();

      const descriptives = response.descriptives;
      const frequencyKeys = Object.keys(response.frequencies.frequencies);
      const frequencies: any = {};
      for (let i = 0; i < frequencyKeys.length; i++) {
        frequencies[frequencyKeys[i]] = [];
        for (let j = 0; j < response.frequencies.frequencies[frequencyKeys[i]].length; j++) {

          const val = {
            frequency: response.frequencies.frequencies[frequencyKeys[i]][j]['Freq'],
            label: response.frequencies.frequencies[frequencyKeys[i]][j]['Var1'],
            relative: response.frequencies['relative.frequencies'][frequencyKeys[i]][j]
          };
          frequencies[frequencyKeys[i]].push(val);
        }
      }


      const boxplotResponse = response.boxplot;
      const boxplots = [];
      const boxplotkeys = Object.keys(boxplotResponse);
      for (let i = 0; i < boxplotkeys.length; i++) {
        const boxPlot = boxplotResponse[boxplotkeys[i]];
        boxPlot['label'] = boxplotkeys[i];
        boxplots.push(boxPlot);
      }

      const hist = response.histogram;

      return {
        descriptives: descriptives,
        frequencies: frequencies,
        boxplot: boxplots,
        histogram: hist
      };
    });


  }


}


class PureURIEncoder extends QueryEncoder {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}

