import path from 'path';
export const OutputTypes = {
    Component: 'component',
    Scam: 'scam',
    Standalone: 'standalone',
};
export const toLowerCase = (str) => str.toLowerCase();
export const dashToPascalCase = (str) => toLowerCase(str)
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
export function sortBy(array, prop) {
    return array.slice().sort((a, b) => {
        const nameA = prop(a);
        const nameB = prop(b);
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
}
export function normalizePath(str) {
    // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
    // https://github.com/sindresorhus/slash MIT
    // By Sindre Sorhus
    if (typeof str !== 'string') {
        throw new Error(`invalid path to normalize`);
    }
    str = str.trim();
    if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
        return str;
    }
    str = str.replace(SLASH_REGEX, '/');
    // always remove the trailing /
    // this makes our file cache look ups consistent
    if (str.charAt(str.length - 1) === '/') {
        const colonIndex = str.indexOf(':');
        if (colonIndex > -1) {
            if (colonIndex < str.length - 2) {
                str = str.substring(0, str.length - 1);
            }
        }
        else if (str.length > 1) {
            str = str.substring(0, str.length - 1);
        }
    }
    return str;
}
export function relativeImport(pathFrom, pathTo, ext) {
    let relativePath = path.relative(path.dirname(pathFrom), path.dirname(pathTo));
    if (relativePath === '') {
        relativePath = '.';
    }
    else if (relativePath[0] !== '.') {
        relativePath = './' + relativePath;
    }
    return normalizePath(`${relativePath}/${path.basename(pathTo, ext)}`);
}
export function isRelativePath(path) {
    return path && path.startsWith('.');
}
export async function readPackageJson(config, rootDir) {
    var _a;
    const pkgJsonPath = path.join(rootDir, 'package.json');
    let pkgJson;
    try {
        pkgJson = (await ((_a = config.sys) === null || _a === void 0 ? void 0 : _a.readFile(pkgJsonPath, 'utf8')));
    }
    catch (e) {
        throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
    }
    let pkgData;
    try {
        pkgData = JSON.parse(pkgJson);
    }
    catch (e) {
        throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
    }
    return pkgData;
}
/**
 * Formats an array of strings to a string of quoted, comma separated values.
 * @param list The list of unformatted strings to format
 * @returns The formatted array of strings. (e.g. ['foo', 'bar']) => `'foo', 'bar'`
 */
export const formatToQuotedList = (list) => list.map((item) => `'${item}'`).join(', ');
/**
 * Creates an import statement for a list of named imports from a module.
 * @param imports The list of named imports.
 * @param module The module to import from.
 *
 * @returns The import statement as a string.
 */
export const createImportStatement = (imports, module) => {
    if (imports.length === 0) {
        return '';
    }
    return `import { ${imports.join(', ')} } from '${module}';`;
};
/**
 * Checks if the outputType is for the custom elements build.
 * @param outputType The output type.
 * @returns `true` if the output type is for the custom elements build.
 */
export const isOutputTypeCustomElementsBuild = (outputType) => {
    return outputType === OutputTypes.Standalone || outputType === OutputTypes.Scam;
};
/**
 * Creates the collection of import statements for a component based on the component's events type dependencies.
 * @param componentTagName The tag name of the component (pascal case).
 * @param events The events compiler metadata.
 * @param options The options for generating the import statements (e.g. whether to import from the custom elements directory).
 * @returns The import statements as an array of strings.
 */
export const createComponentEventTypeImports = (componentTagName, events, options) => {
    const { componentCorePackage, customElementsDir } = options;
    const imports = [];
    const namedImports = new Set();
    const isCustomElementsBuild = isOutputTypeCustomElementsBuild(options.outputType);
    const importPathName = normalizePath(componentCorePackage) + (isCustomElementsBuild ? `/${customElementsDir}` : '');
    events.forEach((event) => {
        Object.entries(event.complexType.references).forEach(([typeName, refObject]) => {
            if (refObject.location === 'local' || refObject.location === 'import') {
                const newTypeName = `I${componentTagName}${typeName}`;
                // Prevents duplicate imports for the same type.
                if (!namedImports.has(newTypeName)) {
                    imports.push(`import type { ${typeName} as ${newTypeName} } from '${importPathName}';`);
                    namedImports.add(newTypeName);
                }
            }
        });
    });
    return imports.join('\n');
};
const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;
