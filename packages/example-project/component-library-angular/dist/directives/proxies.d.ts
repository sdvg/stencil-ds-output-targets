import { ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { Components } from 'component-library';
import { Button as IButton } from 'component-library/dist/types/components/my-button/my-button';
export declare interface MyButton extends Components.MyButton {
}
export declare class MyButton {
    protected z: NgZone;
    /** Emitted when the button has focus. */
    myFocus: IButton['myFocus'];
    /** Emitted when the button loses focus. */
    myBlur: IButton['myBlur'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { Checkbox as ICheckbox } from 'component-library/dist/types/components/my-checkbox/my-checkbox';
export declare interface MyCheckbox extends Components.MyCheckbox {
}
export declare class MyCheckbox {
    protected z: NgZone;
    /** Emitted when the checked property has changed. */
    myChange: ICheckbox['myChange'];
    /** Emitted when the toggle has focus. */
    myFocus: ICheckbox['myFocus'];
    /** Emitted when the toggle loses focus. */
    myBlur: ICheckbox['myBlur'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { MyComponent as IMyComponent } from 'component-library/dist/types/components/my-component/my-component';
export declare interface MyComponent extends Components.MyComponent {
}
export declare class MyComponent {
    protected z: NgZone;
    /** Testing an event without value */
    myCustomEvent: IMyComponent['myCustomEvent'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { Input as IInput } from 'component-library/dist/types/components/my-input/my-input';
export declare interface MyInput extends Components.MyInput {
}
export declare class MyInput {
    protected z: NgZone;
    /** Emitted when a keyboard input occurred. */
    myInput: IInput['myInput'];
    /** Emitted when the value has changed. */
    myChange: IInput['myChange'];
    /** Emitted when the input loses focus. */
    myBlur: IInput['myBlur'];
    /** Emitted when the input has focus. */
    myFocus: IInput['myFocus'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { Popover as IPopover } from 'component-library/dist/types/components/my-dialog/my-dialog';
export declare interface MyPopover extends Components.MyPopover {
}
export declare class MyPopover {
    protected z: NgZone;
    /** Emitted after the popover has presented. */
    myPopoverDidPresent: IPopover['didPresent'];
    /** Emitted before the popover has presented. */
    myPopoverWillPresent: IPopover['willPresent'];
    /** Emitted before the popover has dismissed. */
    myPopoverWillDismiss: IPopover['willDismiss'];
    /** Emitted after the popover has dismissed. */
    myPopoverDidDismiss: IPopover['didDismiss'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { Radio as IRadio } from 'component-library/dist/types/components/my-radio/my-radio';
export declare interface MyRadio extends Components.MyRadio {
}
export declare class MyRadio {
    protected z: NgZone;
    /** Emitted when the radio button has focus. */
    myFocus: IRadio['myFocus'];
    /** Emitted when the radio button loses focus. */
    myBlur: IRadio['myBlur'];
    /** Emitted when the radio button loses focus. */
    mySelect: IRadio['mySelect'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { RadioGroup as IRadioGroup } from 'component-library/dist/types/components/my-radio-group/my-radio-group';
export declare interface MyRadioGroup extends Components.MyRadioGroup {
}
export declare class MyRadioGroup {
    protected z: NgZone;
    /** Emitted when the value has changed. */
    myChange: IRadioGroup['myChange'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
import { Range as IRange } from 'component-library/dist/types/components/my-range/my-range';
export declare interface MyRange extends Components.MyRange {
}
export declare class MyRange {
    protected z: NgZone;
    /** Emitted when the value property has changed. */
    myChange: IRange['myChange'];
    /** Emitted when the range has focus. */
    myFocus: IRange['myFocus'];
    /** Emitted when the range loses focus. */
    myBlur: IRange['myBlur'];
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, z: NgZone);
}
