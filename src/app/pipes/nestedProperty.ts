import {Pipe, PipeTransform} from '@angular/core';

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
@Pipe({name: 'nestedProperty'})
export class NestedPropertyPipe implements PipeTransform {
  transform(value: any, accessor:string): any {

    accessor = accessor.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    accessor = accessor.replace(/^\./, '');           // strip a leading dot
    var a = accessor.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in value) {
        value = value[k];
      } else {
        return;
      }
    }
    return value;
  }
}
