'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var util = require('util');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

const readFile = util.promisify(fs__default['default'].readFile);
/**
 * Send a string to lowercase
 * @param str the string to lowercase
 * @returns the lowercased string
 */
const toLowerCase = (str) => str.toLowerCase();
/**
 * Convert a string using dash-case to PascalCase
 * @param str the string to convert to PascalCase
 * @returns the PascalCased string
 */
const dashToPascalCase = (str) => toLowerCase(str)
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
/**
 * Sorts a provided array by a property belonging to an item that exists on each item in the array
 * @param array the array to sort
 * @param prop a function to look up a field on an entry in the provided array
 * @returns a shallow copy of the array, sorted by the property resolved by `prop`
 */
function sortBy(array, prop) {
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
/**
 * Normalize a path
 * @param str the path to normalize
 * @returns the normalized path
 */
function normalizePath(str) {
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
/**
 * Generate the relative import from `pathFrom` to `pathTo`
 * @param pathFrom the path that shall be used as the origin in determining the relative path
 * @param pathTo the path that shall be used as the destination in determining the relative path
 * @param ext an extension to remove from the final path
 * @returns the derived relative import
 */
function relativeImport(pathFrom, pathTo, ext) {
    let relativePath = path__default['default'].relative(path__default['default'].dirname(pathFrom), path__default['default'].dirname(pathTo));
    if (relativePath === '') {
        relativePath = '.';
    }
    else if (relativePath[0] !== '.') {
        relativePath = './' + relativePath;
    }
    return normalizePath(`${relativePath}/${path__default['default'].basename(pathTo, ext)}`);
}
/**
 * Attempts to read a `package.json` file at the provided directory.
 * @param rootDir the directory to search for the `package.json` file to read
 * @returns the read and parsed `package.json` file
 */
async function readPackageJson(rootDir) {
    const pkgJsonPath = path__default['default'].join(rootDir, 'package.json');
    let pkgJson;
    try {
        pkgJson = await readFile(pkgJsonPath, 'utf8');
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
const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;

/**
 * Generate and write the Stencil-React bindings to disc
 * @param config the Stencil configuration associated with the project
 * @param compilerCtx the compiler context of the current Stencil build
 * @param outputTarget the output target configuration for generating the React wrapper
 * @param components the components to generate the bindings for
 */
async function reactProxyOutput(config, compilerCtx, outputTarget, components) {
    const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components);
    const rootDir = config.rootDir;
    const pkgData = await readPackageJson(rootDir);
    const finalText = generateProxies(config, filteredComponents, pkgData, outputTarget, rootDir);
    await compilerCtx.fs.writeFile(outputTarget.proxiesFile, finalText);
    await copyResources(config, outputTarget);
}
/**
 * Removes all components from the provided `cmps` list that exist in the provided `excludedComponents` list
 * @param excludeComponents the list of components that should be removed from the provided `cmps` list
 * @param cmps a list of components
 * @returns the filtered list of components
 */
function getFilteredComponents(excludeComponents = [], cmps) {
    return sortBy(cmps, (cmp) => cmp.tagName).filter((c) => !excludeComponents.includes(c.tagName) && !c.internal);
}
/**
 * Generate the code that will be responsible for creating the Stencil-React bindings
 * @param config the Stencil configuration associated with the project
 * @param components the Stencil components to generate wrappers for
 * @param pkgData `package.json` data for the Stencil project
 * @param outputTarget the output target configuration used to generate the Stencil-React bindings
 * @param rootDir the directory of the Stencil project
 * @returns the generated code to create the Stencil-React bindings
 */
function generateProxies(config, components, pkgData, outputTarget, rootDir) {
    const distTypesDir = path__default['default'].dirname(pkgData.types);
    const dtsFilePath = path__default['default'].join(rootDir, distTypesDir, GENERATED_DTS);
    const componentsTypeFile = relativeImport(outputTarget.proxiesFile, dtsFilePath, '.d.ts');
    const pathToCorePackageLoader = getPathToCorePackageLoader(config, outputTarget);
    const imports = `/* eslint-disable */
/* tslint:disable */
/* auto-generated react proxies */
import { createReactComponent, setCustomTagNameTransformer } from './react-component-lib';
\n`;
    /**
     * Generate JSX import type from correct location.
     * When using custom elements build, we need to import from
     * either the "components" directory or customElementsDir
     * otherwise we risk bundlers pulling in lazy loaded imports.
     */
    const generateTypeImports = () => {
        if (outputTarget.componentCorePackage !== undefined) {
            const dirPath = outputTarget.includeImportCustomElements
                ? `/${outputTarget.customElementsDir || 'components'}`
                : '';
            return `import type { ${IMPORT_TYPES} } from '${normalizePath(outputTarget.componentCorePackage)}${dirPath}';\n`;
        }
        return `import type { ${IMPORT_TYPES} } from '${normalizePath(componentsTypeFile)}';\n`;
    };
    const typeImports = generateTypeImports();
    let sourceImports = '';
    let registerCustomElements = '';
    /**
     * Build an array of Custom Elements build imports and namespace them so that they do not conflict with the React
     * wrapper names. For example, IonButton would be imported as IonButtonCmp to not conflict with the IonButton React
     * Component that takes in the Web Component as a parameter.
     */
    if (outputTarget.includeImportCustomElements && outputTarget.componentCorePackage !== undefined) {
        const cmpImports = components.map((component) => {
            const pascalImport = dashToPascalCase(component.tagName);
            return `import { defineCustomElement as define${pascalImport} } from '${normalizePath(outputTarget.componentCorePackage)}/${outputTarget.customElementsDir || 'components'}/${component.tagName}.js';`;
        });
        sourceImports = cmpImports.join('\n');
    }
    else if (outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
        sourceImports = `import { ${APPLY_POLYFILLS}, ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`;
        registerCustomElements = `${APPLY_POLYFILLS}().then(() => ${REGISTER_CUSTOM_ELEMENTS}());`;
    }
    else if (!outputTarget.includePolyfills && outputTarget.includeDefineCustomElements) {
        sourceImports = `import { ${REGISTER_CUSTOM_ELEMENTS} } from '${pathToCorePackageLoader}';\n`;
        registerCustomElements = `${REGISTER_CUSTOM_ELEMENTS}();`;
    }
    const final = [
        imports,
        typeImports,
        sourceImports,
        registerCustomElements,
        components
            .map((cmpMeta) => createComponentDefinition(cmpMeta, outputTarget.includeImportCustomElements))
            .join('\n'),
        `export { setCustomTagNameTransformer };`,
    ];
    return final.join('\n') + '\n';
}
/**
 * Defines the React component that developers will import to use in their applications.
 * @param cmpMeta Meta data for a single Web Component
 * @param includeCustomElement If `true`, the Web Component instance will be passed in to createReactComponent to be
 * registered with the Custom Elements Registry.
 * @returns An array where each entry is a string version of the React component definition.
 */
function createComponentDefinition(cmpMeta, includeCustomElement = false) {
    const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
    let template = `export const ${tagNameAsPascal} = /*@__PURE__*/createReactComponent<${IMPORT_TYPES}.${tagNameAsPascal}, HTML${tagNameAsPascal}Element>('${cmpMeta.tagName}'`;
    if (includeCustomElement) {
        template += `, undefined, undefined, define${tagNameAsPascal}`;
    }
    template += `);`;
    return [template];
}
/**
 * Copy resources used to generate the Stencil-React bindings. The resources copied here are not specific a project's
 * Stencil components, but rather the logic used to do the actual component generation.
 * @param config the Stencil configuration associated with the project
 * @param outputTarget the output target configuration for generating the Stencil-React bindings
 * @returns The results of performing the copy
 */
async function copyResources(config, outputTarget) {
    if (!config.sys || !config.sys.copy || !config.sys.glob) {
        throw new Error('stencil is not properly initialized at this step. Notify the developer');
    }
    const srcDirectory = path__default['default'].join(__dirname, '..', 'react-component-lib');
    const destDirectory = path__default['default'].join(path__default['default'].dirname(outputTarget.proxiesFile), 'react-component-lib');
    return config.sys.copy([
        {
            src: srcDirectory,
            dest: destDirectory,
            keepDirStructure: false,
            warn: false,
        },
    ], srcDirectory);
}
/**
 * Derive the path to the loader
 * @param config the Stencil configuration for the project
 * @param outputTarget the output target used for generating the Stencil-React bindings
 * @returns the derived loader path
 */
function getPathToCorePackageLoader(config, outputTarget) {
    var _a;
    const basePkg = outputTarget.componentCorePackage || '';
    const distOutputTarget = (_a = config.outputTargets) === null || _a === void 0 ? void 0 : _a.find((o) => o.type === 'dist');
    const distAbsEsmLoaderPath = (distOutputTarget === null || distOutputTarget === void 0 ? void 0 : distOutputTarget.esmLoaderPath) && path__default['default'].isAbsolute(distOutputTarget.esmLoaderPath)
        ? distOutputTarget.esmLoaderPath
        : null;
    const distRelEsmLoaderPath = config.rootDir && distAbsEsmLoaderPath ? path__default['default'].relative(config.rootDir, distAbsEsmLoaderPath) : null;
    const loaderDir = outputTarget.loaderDir || distRelEsmLoaderPath || DEFAULT_LOADER_DIR;
    return normalizePath(path__default['default'].join(basePkg, loaderDir));
}
const GENERATED_DTS = 'components.d.ts';
const IMPORT_TYPES = 'JSX';
const REGISTER_CUSTOM_ELEMENTS = 'defineCustomElements';
const APPLY_POLYFILLS = 'applyPolyfills';
const DEFAULT_LOADER_DIR = '/dist/loader';

/**
 * Creates an output target for binding Stencil components to be used in a React context
 * @param outputTarget the user-defined output target defined in a Stencil configuration file
 * @returns an output target that can be used by the Stencil compiler
 */
const reactOutputTarget = (outputTarget) => ({
    type: 'custom',
    name: 'react-library',
    validate(config) {
        return normalizeOutputTarget(config, outputTarget);
    },
    async generator(config, compilerCtx, buildCtx) {
        const timespan = buildCtx.createTimeSpan(`generate react started`, true);
        await reactProxyOutput(config, compilerCtx, outputTarget, buildCtx.components);
        timespan.finish(`generate react finished`);
    },
});
/**
 * Normalizes the structure of a provided output target and verifies a Stencil configuration
 * associated with the wrapper is valid
 * @param config the configuration to validate
 * @param outputTarget the output target to normalize
 * @returns an output target that's been normalized
 */
function normalizeOutputTarget(config, outputTarget) {
    var _a, _b;
    const results = Object.assign(Object.assign({}, outputTarget), { excludeComponents: outputTarget.excludeComponents || [], includePolyfills: (_a = outputTarget.includePolyfills) !== null && _a !== void 0 ? _a : true, includeDefineCustomElements: (_b = outputTarget.includeDefineCustomElements) !== null && _b !== void 0 ? _b : true });
    if (config.rootDir == null) {
        throw new Error('rootDir is not set and it should be set by stencil itself');
    }
    if (outputTarget.proxiesFile == null) {
        throw new Error('proxiesFile is required');
    }
    if (outputTarget.includeDefineCustomElements && outputTarget.includeImportCustomElements) {
        throw new Error('includeDefineCustomElements cannot be used at the same time as includeImportCustomElements since includeDefineCustomElements is used for lazy loading components. Set `includeDefineCustomElements: false` in your React output target config to resolve this.');
    }
    if (outputTarget.includeImportCustomElements && outputTarget.includePolyfills) {
        throw new Error('includePolyfills cannot be used at the same time as includeImportCustomElements. Set `includePolyfills: false` in your React output target config to resolve this.');
    }
    if (outputTarget.directivesProxyFile && !path__default['default'].isAbsolute(outputTarget.directivesProxyFile)) {
        results.proxiesFile = normalizePath(path__default['default'].join(config.rootDir, outputTarget.proxiesFile));
    }
    return results;
}

exports.reactOutputTarget = reactOutputTarget;
