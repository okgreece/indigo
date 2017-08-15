import { NgModule } from '@angular/core';

import { AddCommasPipe } from './add-commas';
import { EllipsisPipe } from './ellipsis';
import { IterablePipe } from './mapToIterable';
import { NestedPropertyPipe } from './nestedProperty';
import {IterablePairsPipe} from './mapToPairsIterable';
import {InputMapToIterable} from './inputMapToIterable';


export const PIPES = [
  AddCommasPipe,
  EllipsisPipe,
  IterablePipe,
  InputMapToIterable,
  NestedPropertyPipe,
  IterablePairsPipe
];

@NgModule({
  declarations: PIPES,
  exports: PIPES
})
export class PipesModule { }
