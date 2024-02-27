import type { ComponentCompilerEvent } from '@stencil/core/internal';
import type { OutputType } from './types';
/**
 * Creates an Angular component declaration from formatted Stencil compiler metadata.
 *
 * @param tagName The tag name of the component.
 * @param inputs The inputs of the Stencil component (e.g. ['myInput']).
 * @param outputs The outputs/events of the Stencil component. (e.g. ['myOutput']).
 * @param methods The methods of the Stencil component. (e.g. ['myMethod']).
 * @param includeImportCustomElements Whether to define the component as a custom element.
 * @param standalone Whether to define the component as a standalone component.
 * @returns The component declaration as a string.
 */
export declare const createAngularComponentDefinition: (tagName: string, inputs: readonly string[], outputs: readonly string[], methods: readonly string[], includeImportCustomElements?: boolean, standalone?: boolean) => string;
/**
 * Creates the component interface type definition.
 * @param outputType The output type.
 * @param tagNameAsPascal The tag name as PascalCase.
 * @param events The events to generate the interface properties for.
 * @param componentCorePackage The component core package.
 * @param customElementsDir The custom elements directory.
 * @returns The component interface type definition as a string.
 */
export declare const createComponentTypeDefinition: (outputType: OutputType, tagNameAsPascal: string, events: readonly ComponentCompilerEvent[], componentCorePackage: string, customElementsDir?: string | undefined) => string;
