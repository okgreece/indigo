import {Pipe, PipeTransform} from '@angular/core';
import {Input, InputTypes} from "../models/analysis/input";

/**
 * Iterable Pipe
 *
 * It accepts Objects and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *
 * Example:
 *
 *  <div *ngFor="let keyValuePair of someObject | iterable">
 *    key {{keyValuePair.key}} and value {{keyValuePair.value}}
 *  </div>
 *
 */
@Pipe({name: 'inputIterable'})
export class InputMapToIterable implements PipeTransform {
  transform(iterable: Map<string, Input>, args: any[]): any[] {
    let result: any[] = [];
    if (iterable) {
      if (iterable.entries) {
        iterable.forEach((value: any) => {
          result.push( value);
        });
      } else {
        for (const key in iterable) {
          if (iterable.hasOwnProperty(key)) {
            result.push(iterable[key]);
          }
        }
      }
    }

    result = result.sort((a: Input, b: Input) => ((a.type === InputTypes.BABBAGE_FACT_URI || a.type === InputTypes.BABBAGE_AGGREGATE_URI) && (b.type !== InputTypes.BABBAGE_FACT_URI && b.type !== InputTypes.BABBAGE_AGGREGATE_URI) ? -1
      : (b.type === InputTypes.BABBAGE_FACT_URI || b.type === InputTypes.BABBAGE_AGGREGATE_URI) && (a.type !== InputTypes.BABBAGE_FACT_URI && a.type !== InputTypes.BABBAGE_AGGREGATE_URI)  ? 1 : 0));

    return result;
  }
}
