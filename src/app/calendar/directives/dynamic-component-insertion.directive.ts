import { Directive } from '@angular/core';
import { ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicComponentInsertion]'
})
export class DynamicComponentInsertionDirective {

  constructor(public viewContainerRef: ViewContainerRef) {

   }

}
