import { ComponentCompilerEvent, Config } from '@stencil/core/internal';
import { OutputType, PackageJSON } from './types';
export declare const OutputTypes: {
    [key: string]: OutputType;
};
export declare const toLowerCase: (str: string) => string;
export declare const dashToPascalCase: (str: string) => string;
export declare function sortBy<T>(array: T[], prop: (item: T) => string): T[];
export declare function normalizePath(str: string): string;
export declare function relativeImport(pathFrom: string, pathTo: string, ext?: string): string;
export declare function isRelativePath(path: string): boolean | "";
export declare function readPackageJson(config: Config, rootDir: string): Promise<PackageJSON>;
/**
 * Formats an array of strings to a string of quoted, comma separated values.
 * @param list The list of unformatted strings to format
 * @returns The formatted array of strings. (e.g. ['foo', 'bar']) => `'foo', 'bar'`
 */
export declare const formatToQuotedList: (list: readonly string[]) => string;
/**
 * Creates an import statement for a list of named imports from a module.
 * @param imports The list of named imports.
 * @param module The module to import from.
 *
 * @returns The import statement as a string.
 */
export declare const createImportStatement: (imports: string[], module: string) => string;
/**
 * Checks if the outputType is for the custom elements build.
 * @param outputType The output type.
 * @returns `true` if the output type is for the custom elements build.
 */
export declare const isOutputTypeCustomElementsBuild: (outputType: OutputType) => boolean;
/**
 * Creates the collection of import statements for a component based on the component's events type dependencies.
 * @param componentTagName The tag name of the component (pascal case).
 * @param events The events compiler metadata.
 * @param options The options for generating the import statements (e.g. whether to import from the custom elements directory).
 * @returns The import statements as an array of strings.
 */
export declare const createComponentEventTypeImports: (componentTagName: string, events: readonly ComponentCompilerEvent[], options: {
    componentCorePackage: string;
    customElementsDir?: string;
    outputType: OutputType;
}) => string;
