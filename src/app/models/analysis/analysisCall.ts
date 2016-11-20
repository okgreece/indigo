import {Input} from "./input";
import {Algorithm} from './algorithm'
import {Cube} from "../cube";
/**
 * Created by larjo on 13/10/2016.
 */
export class AnalysisCall{

public inputs:any = {};
public outputs: any = {};



public constructor(public algorithm: Algorithm, public cube: Cube){

  if(algorithm.inputs.entries()) {
    algorithm.inputs.forEach((value, key) => {
      this.inputs[value.name] =null;

    });

    this.outputs["json"]=null;
  }


}

}
