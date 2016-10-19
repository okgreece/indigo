/**
 * Created by larjo_000 on 6/8/2016.
 */
import {PrettyJsonPipe} from 'angular2-prettyjson';
import {PipeTransform, Pipe} from "@angular/core";
@Pipe({name: 'prettyjson'})
export  class MyPrettyJsonPipe extends PrettyJsonPipe {

}
