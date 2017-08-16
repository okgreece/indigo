import {EventEmitter, Output} from '@angular/core';

export abstract class ApiRequest {

  public abstract get actual_attributes();


  @Output()
  public abstract actual_attributes_change: EventEmitter<any> = new EventEmitter<any>();


}
