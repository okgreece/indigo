/**
 * Created by larjo on 26/8/2016.
 */
export class Transitivity{



  public constructor( public key:string, public label:string){

  }


  public static staticFactory(): Transitivity[]{
    let transitivities = [];

    transitivities.push(new Transitivity("", "none"));
    transitivities.push(new Transitivity("*", "zero or more"));



    return transitivities;

  }

}
