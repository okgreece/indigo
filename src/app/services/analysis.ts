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
  private API_PATH:string = 'http://localhost/rudolf/public/api/v3/cubes';

  constructor(private http:Http, public rudolfService: RudolfCubesService) {
  }

 execute(algorithm:Algorithm, call: AnalysisCall){

   let that = this;

   if(algorithm.name=="time_series"){

     let subscription = this.rudolfService.aggregate(call.inputs["json_data"]).map(function (json) {
       let body = new URLSearchParams();
       body.set('json_data', "'"+JSON.stringify(json)+"'");
       body.set('amount', call.inputs["amount"].ref);
       body.set('time', call.inputs["time"].ref);
       body.set('prediction_steps', call.inputs["prediction_steps"]);


       return that.http.post(algorithm.endpoint.toString()+"/print", body).map(res=>{
         debugger;
         let response = res.json();
         let data = response[2];
         let values:any = [];
         for(let i=0;i<data.data_year.length;i++){
           values.push({
             year: parseInt(data.data_year[i]),
             amount:parseFloat(data.data[i])
           });
         }
         for(let i=0;i<data.predict_time.length;i++){
           values.push({
             year:parseInt(data.predict_time[i]),
             amount:parseFloat(data.predict_values[i]),
             up80:parseFloat(data.up80[i]),
             up95:parseFloat(data.up95[i]),
             low80:parseFloat(data.low80[i]),
             low95:parseFloat(data.low95[i])
           });
         }

         return values;
       });


     });
     return  subscription.switch();


   }


 }


}
