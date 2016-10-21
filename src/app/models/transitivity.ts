import {Serializable} from "./iserializeable";
/**
 * Created by larjo on 26/8/2016.
 */
export class Transitivity implements Serializable<Transitivity>{


  deserialize(input: any): Transitivity {
    let transitivity = new Transitivity();
    transitivity.key = input.key;
    transitivity.label = input.label;

    return transitivity;
  }

  serialize(input: Transitivity): any {
    return input;
  }



  public constructor( ){

  }

  public key:string;
  public label:string;

  public static staticFactory(): Transitivity[]{
    let transitivities = [];
    let direct = new Transitivity;
    direct.key = "";
    direct.label = "direct relation";

    transitivities.push(direct);


    let zeromore = new Transitivity;
    zeromore.key = "*";
    zeromore.label = "zero or more steps";

    transitivities.push(zeromore);


    let reverse = new Transitivity;
    reverse.key = "^";
    reverse.label = "reverse relation";

    transitivities.push(reverse);





    return transitivities;

  }

}
