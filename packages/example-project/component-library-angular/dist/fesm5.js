import { __decorate, __metadata, __extends } from 'tslib';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, NgZone, HostListener, Directive, NgModule } from '@angular/core';
import { fromEvent } from 'rxjs';
import { defineCustomElements } from 'component-library/loader';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var proxyInputs = (/**
 * @param {?} Cmp
 * @param {?} inputs
 * @return {?}
 */
function (Cmp, inputs) {
    /** @type {?} */
    var Prototype = Cmp.prototype;
    inputs.forEach((/**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        Object.defineProperty(Prototype, item, {
            get: /**
             * @return {?}
             */
            function () {
                return this.el[item];
            },
            set: /**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                var _this = this;
                this.z.runOutsideAngular((/**
                 * @return {?}
                 */
                function () { return (_this.el[item] = val); }));
            },
        });
    }));
});
/** @type {?} */
var proxyMethods = (/**
 * @param {?} Cmp
 * @param {?} methods
 * @return {?}
 */
function (Cmp, methods) {
    /** @type {?} */
    var Prototype = Cmp.prototype;
    methods.forEach((/**
     * @param {?} methodName
     * @return {?}
     */
    function (methodName) {
        Prototype[methodName] = (/**
         * @return {?}
         */
        function () {
            var _this = this;
            /** @type {?} */
            var args = arguments;
            return this.z.runOutsideAngular((/**
             * @return {?}
             */
            function () { return _this.el[methodName].apply(_this.el, args); }));
        });
    }));
});
/** @type {?} */
var proxyOutputs = (/**
 * @param {?} instance
 * @param {?} el
 * @param {?} events
 * @return {?}
 */
function (instance, el, events) {
    events.forEach((/**
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) { return (instance[eventName] = fromEvent(el, eventName)); }));
});
// tslint:disable-next-line: only-arrow-functions
/**
 * @param {?} opts
 * @return {?}
 */
function ProxyCmp(opts) {
    /** @type {?} */
    var decorator = (/**
     * @param {?} cls
     * @return {?}
     */
    function (cls) {
        if (opts.inputs) {
            proxyInputs(cls, opts.inputs);
        }
        if (opts.methods) {
            proxyMethods(cls, opts.methods);
        }
        return cls;
    });
    return decorator;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var MyButton = /** @class */ (function () {
    function MyButton(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myFocus', 'myBlur']);
    }
    MyButton.decorators = [
        { type: Component, args: [{
                    selector: 'my-button',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'href', 'mode', 'rel', 'shape', 'size', 'strong', 'target', 'type'],
                    outputs: ['myFocus', 'myBlur']
                },] },
    ];
    /** @nocollapse */
    MyButton.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyButton = __decorate([
        ProxyCmp({
            inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'href', 'mode', 'rel', 'shape', 'size', 'strong', 'target', 'type']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyButton);
    return MyButton;
}());
var MyCheckbox = /** @class */ (function () {
    function MyCheckbox(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myChange', 'myFocus', 'myBlur']);
    }
    MyCheckbox.decorators = [
        { type: Component, args: [{
                    selector: 'my-checkbox',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['checked', 'color', 'disabled', 'indeterminate', 'mode', 'name', 'value'],
                    outputs: ['myChange', 'myFocus', 'myBlur']
                },] },
    ];
    /** @nocollapse */
    MyCheckbox.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyCheckbox = __decorate([
        ProxyCmp({
            inputs: ['checked', 'color', 'disabled', 'indeterminate', 'mode', 'name', 'value']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyCheckbox);
    return MyCheckbox;
}());
var MyComponent = /** @class */ (function () {
    function MyComponent(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myCustomEvent']);
    }
    MyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'my-component',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['age', 'first', 'kidsNames', 'last', 'middle'],
                    outputs: ['myCustomEvent']
                },] },
    ];
    /** @nocollapse */
    MyComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyComponent = __decorate([
        ProxyCmp({
            inputs: ['age', 'first', 'kidsNames', 'last', 'middle']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyComponent);
    return MyComponent;
}());
var MyInput = /** @class */ (function () {
    function MyInput(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myInput', 'myChange', 'myBlur', 'myFocus']);
    }
    MyInput.decorators = [
        { type: Component, args: [{
                    selector: 'my-input',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'color', 'disabled', 'enterkeyhint', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'spellcheck', 'step', 'type', 'value'],
                    outputs: ['myInput', 'myChange', 'myBlur', 'myFocus']
                },] },
    ];
    /** @nocollapse */
    MyInput.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyInput = __decorate([
        ProxyCmp({
            inputs: ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'color', 'disabled', 'enterkeyhint', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'spellcheck', 'step', 'type', 'value'],
            methods: ['setFocus', 'getInputElement']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyInput);
    return MyInput;
}());
var MyPopover = /** @class */ (function () {
    function MyPopover(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myPopoverDidPresent', 'myPopoverWillPresent', 'myPopoverWillDismiss', 'myPopoverDidDismiss']);
    }
    MyPopover.decorators = [
        { type: Component, args: [{
                    selector: 'my-popover',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['animated', 'backdropDismiss', 'component', 'componentProps', 'cssClass', 'event', 'keyboardClose', 'mode', 'showBackdrop', 'translucent'],
                    outputs: ['myPopoverDidPresent', 'myPopoverWillPresent', 'myPopoverWillDismiss', 'myPopoverDidDismiss']
                },] },
    ];
    /** @nocollapse */
    MyPopover.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyPopover = __decorate([
        ProxyCmp({
            inputs: ['animated', 'backdropDismiss', 'component', 'componentProps', 'cssClass', 'event', 'keyboardClose', 'mode', 'showBackdrop', 'translucent'],
            methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyPopover);
    return MyPopover;
}());
var MyRadio = /** @class */ (function () {
    function MyRadio(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myFocus', 'myBlur', 'mySelect']);
    }
    MyRadio.decorators = [
        { type: Component, args: [{
                    selector: 'my-radio',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['color', 'disabled', 'mode', 'name', 'value'],
                    outputs: ['myFocus', 'myBlur', 'mySelect']
                },] },
    ];
    /** @nocollapse */
    MyRadio.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyRadio = __decorate([
        ProxyCmp({
            inputs: ['color', 'disabled', 'mode', 'name', 'value']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyRadio);
    return MyRadio;
}());
var MyRadioGroup = /** @class */ (function () {
    function MyRadioGroup(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myChange']);
    }
    MyRadioGroup.decorators = [
        { type: Component, args: [{
                    selector: 'my-radio-group',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['allowEmptySelection', 'name', 'value'],
                    outputs: ['myChange']
                },] },
    ];
    /** @nocollapse */
    MyRadioGroup.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyRadioGroup = __decorate([
        ProxyCmp({
            inputs: ['allowEmptySelection', 'name', 'value']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyRadioGroup);
    return MyRadioGroup;
}());
var MyRange = /** @class */ (function () {
    function MyRange(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['myChange', 'myFocus', 'myBlur']);
    }
    MyRange.decorators = [
        { type: Component, args: [{
                    selector: 'my-range',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    inputs: ['color', 'debounce', 'disabled', 'dualKnobs', 'max', 'min', 'mode', 'name', 'pin', 'snaps', 'step', 'ticks', 'value'],
                    outputs: ['myChange', 'myFocus', 'myBlur']
                },] },
    ];
    /** @nocollapse */
    MyRange.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    MyRange = __decorate([
        ProxyCmp({
            inputs: ['color', 'debounce', 'disabled', 'dualKnobs', 'max', 'min', 'mode', 'name', 'pin', 'snaps', 'step', 'ticks', 'value']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ElementRef, NgZone])
    ], MyRange);
    return MyRange;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ValueAccessor = /** @class */ (function () {
    function ValueAccessor(el) {
        this.el = el;
        this.onChange = (/**
         * @return {?}
         */
        function () { });
        this.onTouched = (/**
         * @return {?}
         */
        function () { });
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ValueAccessor.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ValueAccessor.prototype.handleChangeEvent = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value !== this.lastValue) {
            this.lastValue = value;
            this.onChange(value);
        }
    };
    /**
     * @return {?}
     */
    ValueAccessor.prototype._handleBlurEvent = /**
     * @return {?}
     */
    function () {
        this.onTouched();
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    ValueAccessor.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    ValueAccessor.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    ValueAccessor.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.el.nativeElement.disabled = isDisabled;
    };
    ValueAccessor.propDecorators = {
        _handleBlurEvent: [{ type: HostListener, args: ['focusout',] }]
    };
    return ValueAccessor;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var BooleanValueAccessor = /** @class */ (function (_super) {
    __extends(BooleanValueAccessor, _super);
    function BooleanValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    BooleanValueAccessor.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
    };
    BooleanValueAccessor.decorators = [
        { type: Directive, args: [{
                    /* tslint:disable-next-line:directive-selector */
                    selector: 'my-checkbox',
                    host: {
                        '(myChange)': 'handleChangeEvent($event.target.checked)'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: BooleanValueAccessor,
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    BooleanValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return BooleanValueAccessor;
}(ValueAccessor));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NumericValueAccessor = /** @class */ (function (_super) {
    __extends(NumericValueAccessor, _super);
    function NumericValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    NumericValueAccessor.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        _super.prototype.registerOnChange.call(this, (/**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            fn(value === '' ? null : parseFloat(value));
        }));
    };
    NumericValueAccessor.decorators = [
        { type: Directive, args: [{
                    /* tslint:disable-next-line:directive-selector */
                    selector: 'my-input[type=number]',
                    host: {
                        '(myChange)': 'handleChangeEvent($event.target.value)'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: NumericValueAccessor,
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    NumericValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return NumericValueAccessor;
}(ValueAccessor));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var RadioValueAccessor = /** @class */ (function (_super) {
    __extends(RadioValueAccessor, _super);
    function RadioValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    RadioValueAccessor.decorators = [
        { type: Directive, args: [{
                    /* tslint:disable-next-line:directive-selector */
                    selector: 'my-radio',
                    host: {
                        '(mySelect)': 'handleChangeEvent($event.target.checked)',
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: RadioValueAccessor,
                            multi: true,
                        },
                    ],
                },] },
    ];
    /** @nocollapse */
    RadioValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return RadioValueAccessor;
}(ValueAccessor));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var SelectValueAccessor = /** @class */ (function (_super) {
    __extends(SelectValueAccessor, _super);
    function SelectValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    SelectValueAccessor.decorators = [
        { type: Directive, args: [{
                    /* tslint:disable-next-line:directive-selector */
                    selector: 'my-range, my-radio-group',
                    host: {
                        '(myChange)': 'handleChangeEvent($event.target.value)'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: SelectValueAccessor,
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    SelectValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return SelectValueAccessor;
}(ValueAccessor));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var TextValueAccessor = /** @class */ (function (_super) {
    __extends(TextValueAccessor, _super);
    function TextValueAccessor(el) {
        return _super.call(this, el) || this;
    }
    TextValueAccessor.decorators = [
        { type: Directive, args: [{
                    /* tslint:disable-next-line:directive-selector */
                    selector: 'my-input[type=text]',
                    host: {
                        '(myChange)': 'handleChangeEvent($event.target.value)'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: TextValueAccessor,
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    TextValueAccessor.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    return TextValueAccessor;
}(ValueAccessor));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
defineCustomElements(window);
/** @type {?} */
var DECLARATIONS = [
    // proxies
    MyComponent,
    MyButton,
    MyCheckbox,
    MyInput,
    MyPopover,
    MyRadio,
    MyRadioGroup,
    MyRange,
    // Value Accessors
    BooleanValueAccessor,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor,
];
var ComponentLibraryModule = /** @class */ (function () {
    function ComponentLibraryModule() {
    }
    ComponentLibraryModule.decorators = [
        { type: NgModule, args: [{
                    declarations: DECLARATIONS,
                    exports: DECLARATIONS,
                    imports: [],
                    providers: [],
                },] },
    ];
    return ComponentLibraryModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { ComponentLibraryModule, MyButton, MyCheckbox, MyComponent, MyInput, MyPopover, MyRadio, MyRadioGroup, MyRange, ProxyCmp as ɵa, BooleanValueAccessor as ɵb, ValueAccessor as ɵc, NumericValueAccessor as ɵd, RadioValueAccessor as ɵe, SelectValueAccessor as ɵf, TextValueAccessor as ɵg };
