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
import {RudolfCubesService} from "./rudolf-cubes";
import {Subscription} from "rxjs";

@Injectable()
export class AnalysisService {

  constructor(private http:Http, public rudolfService: RudolfCubesService) {
  }

 execute(algorithm:Algorithm, call: AnalysisCall){

   let that = this;

   if(algorithm.name=="time_series"){

     let subscription = this.rudolfService.aggregate(call.inputs["json_data"]).map(function (json) {
       let body = new URLSearchParams();
       body.set('json_data', "'"+JSON.stringify(json)+"'");
       body.set('amount', "'"+ call.inputs["amount"] + "'");
       body.set('time', "'"+call.inputs["time"]+"'");
       body.set('prediction_steps', call.inputs["prediction_steps"]);

       return that.http.post(algorithm.endpoint.toString()+"/print", body).map(res=>{
         debugger;
         let response = res.json();
         let forecasts = response["forecasts"];
         let values:any = [];
         for(let i=0;i<forecasts.data_year.length;i++){
           values.push({
             year: parseInt(forecasts.data_year[i]),
             amount:parseFloat(forecasts.data[i])
           });
         }
         for(let i=0;i<forecasts.predict_time.length;i++){
           values.push({
             year:parseInt(forecasts.predict_time[i]),
             amount:parseFloat(forecasts.predict_values[i]),
             up80:parseFloat(forecasts.up80[i]),
             up95:parseFloat(forecasts.up95[i]),
             low80:parseFloat(forecasts.low80[i]),
             low95:parseFloat(forecasts.low95[i])
           });
         }
         let acfRegular = response["acf.param"]["acf.parameters"];
         let acfValues = [];

         for(let i=0;i<acfRegular["acf.lag"].length;i++){
           acfValues.push({
            lag:parseFloat(acfRegular["acf.lag"][i]),
             correlation: parseFloat(acfRegular["acf"][i])
           });
         }

         let pacfRegular = response["acf.param"]["pacf.parameters"];
         let pacfValues = [];

         for(let i=0;i<pacfRegular["pacf.lag"].length;i++){
           pacfValues.push({
            lag:parseFloat(pacfRegular["pacf.lag"][i]),
             correlation: parseFloat(pacfRegular["pacf"][i])
           });
         }


         let acfResiduals = response["acf.param"]["acf.residuals.parameters"];
         let acfResValues = [];

         for(let i=0;i<acfResiduals["acf.residuals.lag"].length;i++){
           acfResValues.push({
            lag:parseFloat(acfResiduals["acf.residuals.lag"][i]),
             correlation: parseFloat(acfResiduals["acf.residuals"][i])
           });
         }

         let pacfResiduals = response["acf.param"]["pacf.residuals.parameters"];
         let pacfResValues = [];

         for(let i=0;i<pacfResiduals["pacf.residuals.lag"].length;i++){
           pacfResValues.push({
            lag:parseFloat(pacfResiduals["pacf.residuals.lag"][i]),
             correlation: parseFloat(pacfResiduals["pacf.residuals"][i])
           });
         }


         let stl_plot = response.param[0]["stl.plot"];
         let trends:any = [];
         for(let i=0;i<stl_plot.time.length;i++){
           let val:any = {
             year: parseInt(stl_plot.time[i]),
             amount:parseFloat(stl_plot.trend[i])
           };
           if(stl_plot["conf.interval.low"]){
             val.low80 = stl_plot["conf.interval.low"][i];
           }
           if(stl_plot["conf.interval.up"]){
             val.up80 = stl_plot["conf.interval.up"][i];
           }
           trends.push(val);
         }
         let remainders:any = [];
         for(let i=0;i<stl_plot.time.length;i++){
           let val = {
             year: parseInt(stl_plot.time[i]),
             amount:parseFloat(stl_plot.remainder[i])
           };

           remainders.push(val);
         }



         return {
           forecast:{
             values: values, model: forecasts["ts.model"][0]
           },
           autocorrelation:{
             acf:{
               regular:{
                 values:acfValues,
                 interval_up:acfRegular["confidence.interval.up"][0],
                 interval_low:acfRegular["confidence.interval.low"][0]

               },
               residuals:{
                 values:acfResValues,
                 interval_up:acfResiduals["confidence.interval.up"][0],
                 interval_low:acfResiduals["confidence.interval.low"][0]
               },
             },

             pacf:{
               regular:{
                 values:pacfValues,
                 interval_up:pacfRegular["confidence.interval.up"][0],
                 interval_low:pacfRegular["confidence.interval.low"][0]
               },
               residuals:{
                 values:pacfResValues,
                 interval_up:pacfResiduals["confidence.interval.up"][0],
                 interval_low:pacfResiduals["confidence.interval.low"][0]
               }
             }
           },
           decomposition:{
             trends: trends,
             remainders: remainders

           }




         }
           ;
       });


     });
     return  subscription.switch();


   }


 }


}
