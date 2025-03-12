/**
 * This file was automatically generated by the Stencil React Output Target.
 * Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
 * Do __not__ import components from this file as server side rendered components
 * may not hydrate due to missing Stencil runtime. Instead, import these components through the generated 'components.ts'
 * file that re-exports all components with the 'use client' directive.
 */

/* eslint-disable */

import type { EventName, StencilReactComponent } from '@stencil/react-output-target/runtime';
import { createComponent, createSSRComponent } from '@stencil/react-output-target/runtime';
import { type CheckboxChangeEventDetail, type IMyComponent, type InputChangeEventDetail, type MyCheckboxCustomEvent, type MyComponentCustomEvent, type MyInputCustomEvent, type MyPopoverCustomEvent, type MyRadioGroupCustomEvent, type MyRangeCustomEvent, type OverlayEventDetail, type RadioGroupChangeEventDetail, type RangeChangeEventDetail } from "component-library";
import { MyButton as MyButtonElement, defineCustomElement as defineMyButton } from "component-library/components/my-button.js";
import { MyCheckbox as MyCheckboxElement, defineCustomElement as defineMyCheckbox } from "component-library/components/my-checkbox.js";
import { MyComponent as MyComponentElement, defineCustomElement as defineMyComponent } from "component-library/components/my-component.js";
import { MyInput as MyInputElement, defineCustomElement as defineMyInput } from "component-library/components/my-input.js";
import { MyListItem as MyListItemElement, defineCustomElement as defineMyListItem } from "component-library/components/my-list-item.js";
import { MyList as MyListElement, defineCustomElement as defineMyList } from "component-library/components/my-list.js";
import { MyPopover as MyPopoverElement, defineCustomElement as defineMyPopover } from "component-library/components/my-popover.js";
import { MyRadioGroup as MyRadioGroupElement, defineCustomElement as defineMyRadioGroup } from "component-library/components/my-radio-group.js";
import { MyRadio as MyRadioElement, defineCustomElement as defineMyRadio } from "component-library/components/my-radio.js";
import { MyRange as MyRangeElement, defineCustomElement as defineMyRange } from "component-library/components/my-range.js";
import { MyToggleContent as MyToggleContentElement, defineCustomElement as defineMyToggleContent } from "component-library/components/my-toggle-content.js";
import { MyToggle as MyToggleElement, defineCustomElement as defineMyToggle } from "component-library/components/my-toggle.js";
import React from 'react';

type MyButtonEvents = {
    onMyFocus: EventName<CustomEvent<void>>,
    onMyBlur: EventName<CustomEvent<void>>
};

export const MyButton: StencilReactComponent<MyButtonElement, MyButtonEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyButtonElement, MyButtonEvents>({
        tagName: 'my-button',
        elementClass: MyButtonElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onMyFocus: 'myFocus',
            onMyBlur: 'myBlur'
        } as MyButtonEvents,
        defineCustomElement: defineMyButton
    })
    : /*@__PURE__*/ createSSRComponent<MyButtonElement, MyButtonEvents>({
        tagName: 'my-button',
        properties: {
            color: 'color',
            buttonType: 'button-type',
            disabled: 'disabled',
            expand: 'expand',
            fill: 'fill',
            download: 'download',
            href: 'href',
            rel: 'rel',
            shape: 'shape',
            size: 'size',
            strong: 'strong',
            target: 'target',
            type: 'type'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyCheckboxEvents = {
    onIonChange: EventName<MyCheckboxCustomEvent<CheckboxChangeEventDetail>>,
    onIonFocus: EventName<CustomEvent<void>>,
    onIonBlur: EventName<CustomEvent<void>>
};

export const MyCheckbox: StencilReactComponent<MyCheckboxElement, MyCheckboxEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyCheckboxElement, MyCheckboxEvents>({
        tagName: 'my-checkbox',
        elementClass: MyCheckboxElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onIonChange: 'ionChange',
            onIonFocus: 'ionFocus',
            onIonBlur: 'ionBlur'
        } as MyCheckboxEvents,
        defineCustomElement: defineMyCheckbox
    })
    : /*@__PURE__*/ createSSRComponent<MyCheckboxElement, MyCheckboxEvents>({
        tagName: 'my-checkbox',
        properties: {
            color: 'color',
            name: 'name',
            checked: 'checked',
            indeterminate: 'indeterminate',
            disabled: 'disabled',
            value: 'value',
            labelPlacement: 'label-placement',
            justify: 'justify',
            alignment: 'alignment'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyComponentEvents = {
    onMyCustomEvent: EventName<MyComponentCustomEvent<IMyComponent.someVar>>,
    onMyCustomNestedEvent: EventName<MyComponentCustomEvent<IMyComponent.SomeMoreComplexType.SubType>>
};

export const MyComponent: StencilReactComponent<MyComponentElement, MyComponentEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyComponentElement, MyComponentEvents>({
        tagName: 'my-component',
        elementClass: MyComponentElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onMyCustomEvent: 'myCustomEvent',
            onMyCustomNestedEvent: 'myCustomNestedEvent'
        } as MyComponentEvents,
        defineCustomElement: defineMyComponent
    })
    : /*@__PURE__*/ createSSRComponent<MyComponentElement, MyComponentEvents>({
        tagName: 'my-component',
        properties: {
            first: 'first',
            middle: 'middle',
            last: 'last',
            age: 'age',
            favoriteKidName: 'favorite-kid-name'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyInputEvents = {
    onMyInput: EventName<MyInputCustomEvent<KeyboardEvent>>,
    onMyChange: EventName<MyInputCustomEvent<InputChangeEventDetail>>,
    onMyBlur: EventName<CustomEvent<void>>,
    onMyFocus: EventName<CustomEvent<void>>
};

export const MyInput: StencilReactComponent<MyInputElement, MyInputEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyInputElement, MyInputEvents>({
        tagName: 'my-input',
        elementClass: MyInputElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onMyInput: 'myInput',
            onMyChange: 'myChange',
            onMyBlur: 'myBlur',
            onMyFocus: 'myFocus'
        } as MyInputEvents,
        defineCustomElement: defineMyInput
    })
    : /*@__PURE__*/ createSSRComponent<MyInputElement, MyInputEvents>({
        tagName: 'my-input',
        properties: {
            color: 'color',
            accept: 'accept',
            autocapitalize: 'autocapitalize',
            autocomplete: 'autocomplete',
            autocorrect: 'autocorrect',
            autofocus: 'autofocus',
            clearInput: 'clear-input',
            clearOnEdit: 'clear-on-edit',
            disabled: 'disabled',
            enterkeyhint: 'enterkeyhint',
            inputmode: 'inputmode',
            max: 'max',
            maxlength: 'maxlength',
            min: 'min',
            minlength: 'minlength',
            multiple: 'multiple',
            name: 'name',
            pattern: 'pattern',
            placeholder: 'placeholder',
            readonly: 'readonly',
            required: 'required',
            spellcheck: 'spellcheck',
            step: 'step',
            size: 'size',
            type: 'type',
            value: 'value'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyListEvents = NonNullable<unknown>;

export const MyList: StencilReactComponent<MyListElement, MyListEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyListElement, MyListEvents>({
        tagName: 'my-list',
        elementClass: MyListElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {} as MyListEvents,
        defineCustomElement: defineMyList
    })
    : /*@__PURE__*/ createSSRComponent<MyListElement, MyListEvents>({
        tagName: 'my-list',
        properties: {},
        hydrateModule: import('component-library/hydrate')
    });

type MyListItemEvents = NonNullable<unknown>;

export const MyListItem: StencilReactComponent<MyListItemElement, MyListItemEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyListItemElement, MyListItemEvents>({
        tagName: 'my-list-item',
        elementClass: MyListItemElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {} as MyListItemEvents,
        defineCustomElement: defineMyListItem
    })
    : /*@__PURE__*/ createSSRComponent<MyListItemElement, MyListItemEvents>({
        tagName: 'my-list-item',
        properties: {},
        hydrateModule: import('component-library/hydrate')
    });

type MyPopoverEvents = {
    onMyPopoverDidPresent: EventName<CustomEvent<void>>,
    onMyPopoverWillPresent: EventName<CustomEvent<void>>,
    onMyPopoverWillDismiss: EventName<MyPopoverCustomEvent<OverlayEventDetail>>,
    onMyPopoverDidDismiss: EventName<MyPopoverCustomEvent<OverlayEventDetail>>
};

export const MyPopover: StencilReactComponent<MyPopoverElement, MyPopoverEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyPopoverElement, MyPopoverEvents>({
        tagName: 'my-popover',
        elementClass: MyPopoverElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onMyPopoverDidPresent: 'myPopoverDidPresent',
            onMyPopoverWillPresent: 'myPopoverWillPresent',
            onMyPopoverWillDismiss: 'myPopoverWillDismiss',
            onMyPopoverDidDismiss: 'myPopoverDidDismiss'
        } as MyPopoverEvents,
        defineCustomElement: defineMyPopover
    })
    : /*@__PURE__*/ createSSRComponent<MyPopoverElement, MyPopoverEvents>({
        tagName: 'my-popover',
        properties: {
            component: 'component',
            keyboardClose: 'keyboard-close',
            cssClass: 'css-class',
            backdropDismiss: 'backdrop-dismiss',
            event: 'event',
            showBackdrop: 'show-backdrop',
            translucent: 'translucent',
            animated: 'animated'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyRadioEvents = {
    onIonFocus: EventName<CustomEvent<void>>,
    onIonBlur: EventName<CustomEvent<void>>
};

export const MyRadio: StencilReactComponent<MyRadioElement, MyRadioEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyRadioElement, MyRadioEvents>({
        tagName: 'my-radio',
        elementClass: MyRadioElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onIonFocus: 'ionFocus',
            onIonBlur: 'ionBlur'
        } as MyRadioEvents,
        defineCustomElement: defineMyRadio
    })
    : /*@__PURE__*/ createSSRComponent<MyRadioElement, MyRadioEvents>({
        tagName: 'my-radio',
        properties: {
            color: 'color',
            name: 'name',
            disabled: 'disabled',
            value: 'value',
            labelPlacement: 'label-placement',
            justify: 'justify',
            alignment: 'alignment'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyRadioGroupEvents = { onMyChange: EventName<MyRadioGroupCustomEvent<RadioGroupChangeEventDetail>> };

export const MyRadioGroup: StencilReactComponent<MyRadioGroupElement, MyRadioGroupEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyRadioGroupElement, MyRadioGroupEvents>({
        tagName: 'my-radio-group',
        elementClass: MyRadioGroupElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: { onMyChange: 'myChange' } as MyRadioGroupEvents,
        defineCustomElement: defineMyRadioGroup
    })
    : /*@__PURE__*/ createSSRComponent<MyRadioGroupElement, MyRadioGroupEvents>({
        tagName: 'my-radio-group',
        properties: {
            allowEmptySelection: 'allow-empty-selection',
            compareWith: 'compare-with',
            name: 'name',
            value: 'value'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyRangeEvents = {
    onMyChange: EventName<MyRangeCustomEvent<RangeChangeEventDetail>>,
    onMyFocus: EventName<CustomEvent<void>>,
    onMyBlur: EventName<CustomEvent<void>>
};

export const MyRange: StencilReactComponent<MyRangeElement, MyRangeEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyRangeElement, MyRangeEvents>({
        tagName: 'my-range',
        elementClass: MyRangeElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {
            onMyChange: 'myChange',
            onMyFocus: 'myFocus',
            onMyBlur: 'myBlur'
        } as MyRangeEvents,
        defineCustomElement: defineMyRange
    })
    : /*@__PURE__*/ createSSRComponent<MyRangeElement, MyRangeEvents>({
        tagName: 'my-range',
        properties: {
            color: 'color',
            debounce: 'debounce',
            name: 'name',
            dualKnobs: 'dual-knobs',
            min: 'min',
            max: 'max',
            pin: 'pin',
            snaps: 'snaps',
            step: 'step',
            ticks: 'ticks',
            disabled: 'disabled',
            value: 'value'
        },
        hydrateModule: import('component-library/hydrate')
    });

type MyToggleEvents = NonNullable<unknown>;

export const MyToggle: StencilReactComponent<MyToggleElement, MyToggleEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyToggleElement, MyToggleEvents>({
        tagName: 'my-toggle',
        elementClass: MyToggleElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {} as MyToggleEvents,
        defineCustomElement: defineMyToggle
    })
    : /*@__PURE__*/ createSSRComponent<MyToggleElement, MyToggleEvents>({
        tagName: 'my-toggle',
        properties: {},
        hydrateModule: import('component-library/hydrate')
    });

type MyToggleContentEvents = NonNullable<unknown>;

export const MyToggleContent: StencilReactComponent<MyToggleContentElement, MyToggleContentEvents> = typeof window !== 'undefined'
    ? /*@__PURE__*/ createComponent<MyToggleContentElement, MyToggleContentEvents>({
        tagName: 'my-toggle-content',
        elementClass: MyToggleContentElement,
        // @ts-ignore - React type of Stencil Output Target may differ from the React version used in the Nuxt.js project, this can be ignored.
        react: React,
        events: {} as MyToggleContentEvents,
        defineCustomElement: defineMyToggleContent
    })
    : /*@__PURE__*/ createSSRComponent<MyToggleContentElement, MyToggleContentEvents>({
        tagName: 'my-toggle-content',
        properties: { visible: 'visible' },
        hydrateModule: import('component-library/hydrate')
    });
