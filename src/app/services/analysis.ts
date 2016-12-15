import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from "../models/cube";
import {AggregateRequest} from "../models/aggregate/aggregateRequest";
import {Dimension} from "../models/dimension";
import 'rxjs/add/operator/mergeMap'
import 'rxjs/Subscription'
import {AnalysisCall} from "../models/analysis/analysisCall";
import {Algorithm} from "../models/analysis/algorithm";
import {ApiCubesService} from "./api-cubes";
import {Subscription} from "rxjs";

@Injectable()
export class AnalysisService {

  constructor(private http: Http, public apiService: ApiCubesService) {
  }

  execute(algorithm: Algorithm, call: AnalysisCall): Observable<any> {


    if (algorithm.name === 'time_series') {
      return this.timeseries(algorithm, call.parametrizeInputs());

    }
    else if (algorithm.name === 'descriptive_statistics') {
      return this.descriptive(algorithm, call);
    }


  }

  timeseries(algorithm, inputs: URLSearchParams) {
    let that = this;

    let body = new URLSearchParams();
    body.set('amount', "'" + inputs.get('amount') + "'");
    body.set('time', "'" + inputs.get('time') + "'");
    body.set('prediction_steps', inputs.get('prediction_steps'));
    body.set('json_data', "'" + inputs.get('json_data') + "'");

    return that.http.post(algorithm.endpoint.toString() + '/print', body).map(res => {
      debugger;
      let response = res.json();
      let forecasts = response["forecasts"];
      let values: any = [];
      for (let i = 0; i < forecasts.data_year.length; i++) {
        values.push({
          year: parseInt(forecasts.data_year[i]),
          amount: parseFloat(forecasts.data[i])
        });
      }
      for (let i = 0; i < forecasts.predict_time.length; i++) {
        let val: any = {
          year: parseInt(forecasts.predict_time[i]),
          amount: parseFloat(forecasts.predict_values[i])

        };


        if (!isNaN(forecasts.up80[i])) val.up80 = parseFloat(forecasts.up80[i]);
        if (!isNaN(forecasts.up95[i])) val.up95 = parseFloat(forecasts.up95[i]);
        if (!isNaN(forecasts.low80[i])) val.low80 = parseFloat(forecasts.low80[i]);
        if (!isNaN(forecasts.low95[i])) val.low95 = parseFloat(forecasts.low95[i]);

        values.push(val);
      }
      let acfRegular = response['acf.param']['acf.parameters'];
      let acfValues = [];

      for (let i = 0; i < acfRegular["acf.lag"].length; i++) {
        acfValues.push({
          lag: parseFloat(acfRegular["acf.lag"][i]),
          correlation: parseFloat(acfRegular["acf"][i])
        });
      }

      let pacfRegular = response["acf.param"]["pacf.parameters"];
      let pacfValues = [];

      for (let i = 0; i < pacfRegular["pacf.lag"].length; i++) {
        pacfValues.push({
          lag: parseFloat(pacfRegular["pacf.lag"][i]),
          correlation: parseFloat(pacfRegular["pacf"][i])
        });
      }


      let acfResiduals = response["acf.param"]["acf.residuals.parameters"];
      let acfResValues = [];

      for (let i = 0; i < acfResiduals["acf.residuals.lag"].length; i++) {
        acfResValues.push({
          lag: parseFloat(acfResiduals["acf.residuals.lag"][i]),
          correlation: parseFloat(acfResiduals["acf.residuals"][i])
        });
      }

      let pacfResiduals = response["acf.param"]["pacf.residuals.parameters"];
      let pacfResValues = [];

      for (let i = 0; i < pacfResiduals["pacf.residuals.lag"].length; i++) {
        pacfResValues.push({
          lag: parseFloat(pacfResiduals["pacf.residuals.lag"][i]),
          correlation: parseFloat(pacfResiduals["pacf.residuals"][i])
        });
      }


      let stl_plot = response.decomposition["stl.plot"];
      let trends: any = [];
      for (let i = 0; i < stl_plot.time.length; i++) {
        let val: any = {
          year: parseInt(stl_plot.time[i]),
          amount: parseFloat(stl_plot.trend[i])
        };
        if (stl_plot["conf.interval.low"]) {
          if (!isNaN(stl_plot["conf.interval.low"][i])) val.low80 = parseFloat(stl_plot["conf.interval.low"][i]);
        }
        if (stl_plot["conf.interval.up"]) {
          if (!isNaN(stl_plot["conf.interval.up"][i])) val.up80 = parseFloat(stl_plot["conf.interval.up"][i]);
        }
        trends.push(val);
      }
      let seasonals: any = [];
      for (let i = 0; i < stl_plot.time.length; i++) {
        let val = {
          year: parseInt(stl_plot.time[i]),
          amount: parseFloat(stl_plot.seasonal[i])
        };

        seasonals.push(val);
      }
      let remainders: any = [];
      for (let i = 0; i < stl_plot.time.length; i++) {
        let val = {
          year: parseInt(stl_plot.time[i]),
          amount: parseFloat(stl_plot.remainder[i])
        };

        remainders.push(val);
      }


      let stl_general = response.decomposition["stl.general"];
      let compare = response.decomposition["compare"];

      let residuals = response.decomposition["residuals_fitted"];

      let fitted_residuals: any = [];
      for (let i = 0; i < residuals.fitted.length; i++) {
        let val = {
          year: parseFloat(residuals.fitted[i]),
          amount: parseFloat(residuals.residuals[i])
        };

        fitted_residuals.push(val);
      }


      let time_residuals: any = [];
      for (let i = 0; i < residuals.time.length; i++) {
        let val = {
          year: parseFloat(residuals.time[i]),
          amount: parseFloat(residuals.residuals[i])
        };

        time_residuals.push(val);
      }

      let time_fitted: any = [];
      for (let i = 0; i < residuals.time.length; i++) {
        let val = {
          year: parseFloat(residuals.time[i]),
          amount: parseFloat(residuals.fitted[i])
        };

        time_fitted.push(val);
      }


      let model_fitting = response["model.param"].residuals_fitted;
      let model_fitting_compare = response["model.param"].compare;
      let model = response["model.param"].model;

      let model_fitted_residuals: any = [];
      for (let i = 0; i < model_fitting.fitted.length; i++) {
        let val = {
          year: parseFloat(model_fitting.fitted[i]),
          amount: parseFloat(model_fitting.residuals[i])
        };

        model_fitted_residuals.push(val);
      }


      let model_time_residuals: any = [];
      for (let i = 0; i < model_fitting.time.length; i++) {
        let val = {
          year: parseFloat(model_fitting.time[i]),
          amount: parseFloat(model_fitting.residuals[i])
        };

        model_time_residuals.push(val);
      }

      let model_time_fitted: any = [];
      for (let i = 0; i < model_fitting.time.length; i++) {
        let val = {
          year: parseFloat(model_fitting.time[i]),
          amount: parseFloat(model_fitting.fitted[i])
        };

        model_time_fitted.push(val);
      }


      return {
        forecast: {
          values: values, model: forecasts["ts.model"][0]
        },
        autocorrelation: {
          acf: {
            regular: {
              values: acfValues,
              interval_up: acfRegular["confidence.interval.up"][0],
              interval_low: acfRegular["confidence.interval.low"][0]

            },
            residuals: {
              values: acfResValues,
              interval_up: acfResiduals["confidence.interval.up"][0],
              interval_low: acfResiduals["confidence.interval.low"][0]
            },
          },

          pacf: {
            regular: {
              values: pacfValues,
              interval_up: pacfRegular["confidence.interval.up"][0],
              interval_low: pacfRegular["confidence.interval.low"][0]
            },
            residuals: {
              values: pacfResValues,
              interval_up: pacfResiduals["confidence.interval.up"][0],
              interval_low: pacfResiduals["confidence.interval.low"][0]
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
        ;
    });


  }

  descriptive(algorithm, call) {
    let that = this;
    let body = new URLSearchParams();
    body.set('json_data', "'" + this.apiService.factToUri(call.inputs["json_data"]) + "'"
    )


    ;
    let amountColumnString = "";
    if (call.inputs["amounts"].length > 1) {
      amountColumnString = `c(` + call.inputs["amounts"].map(c => {
          return '"' + c.ref + '"';
        }).join(",") + `)`;
    }
    else {
      amountColumnString = "'" + call.inputs["amounts"][0].ref + "'";
    }

    body.set('amounts', amountColumnString);
    body.set('dimensions', "'" + call.inputs["dimensions"].ref + "'");
    // body.set('x', "'" + JSON.stringify(json) + "'");

    return that.http.post(algorithm.endpoint.toString() + "/print", body).map(res => {
      debugger;
      let response = res.json();

      let dimension = call.inputs["dimensions"].ref;
      let descriptives = response.descriptives;
      let frequencies: any = [];
      for (let i = 0; i < response.frequencies.frequencies.length; i++) {
        let val = {
          frequency: response.frequencies.frequencies[i][dimension],
          label: response.frequencies.frequencies[i]["_row"],
          relative: response.frequencies["relative.frequencies"][i][dimension]
        };

        frequencies.push(val);
      }


      let boxplotResponse = response.boxplot;
      let boxplots = [];
      let boxplotkeys = Object.keys(boxplotResponse);
      for (let i = 0; i < boxplotkeys.length; i++) {
        let boxPlot = boxplotResponse[boxplotkeys[i]];
        boxPlot["label"] = boxplotkeys[i];
        boxplots.push(boxPlot);
      }

      let hist = response.histogram;

      let histograms = [];
      let histogramKeys = Object.keys(hist);
      for (let i = 0; i < histogramKeys.length; i++) {
        let histogram = hist[histogramKeys[i]];
        histogram["label"] = histogramKeys[i];
        histograms.push(histogram);
      }

      return {
        descriptives: descriptives,
        frequencies: frequencies,
        boxplot: boxplots,
        histogram: histograms
      };
    });


  }


}
