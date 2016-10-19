import {Input} from "./input";
import {Algorithm} from './algorithm'
/**
 * Created by larjo on 13/10/2016.
 */
export class AnalysisCall{

public inputs:any = {};
public outputs: any = {};



public constructor(public algorithm: Algorithm){

  if(algorithm.inputs.entries()) {
    algorithm.inputs.forEach((value, key) => {
      this.inputs[value.name] =null;

    });

    this.outputs["json"]=null;
  }


}

}
