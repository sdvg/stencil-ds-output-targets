import { Directive, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '<VALUE_ACCESSOR_SELECTORS>',
  host: {
    '(<VALUE_ACCESSOR_EVENT>)': 'handleChangeEvent($event.target.<VALUE_ACCESSOR_TARGETATTR>)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BooleanValueAccessor,
      multi: true
    }
  ]<VALUE_ACCESSOR_STANDALONE>
})
export class BooleanValueAccessor extends ValueAccessor {
  constructor(el: ElementRef) {
    super(el);
  }
  override writeValue(value: any) {
    this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
  }
}
