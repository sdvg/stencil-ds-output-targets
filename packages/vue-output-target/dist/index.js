import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);
const toLowerCase = (str) => str.toLowerCase();
const dashToPascalCase = (str) => toLowerCase(str)
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
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
function relativeImport(pathFrom, pathTo, ext) {
    let relativePath = path.relative(path.dirname(pathFrom), path.dirname(pathTo));
    if (relativePath === '') {
        relativePath = '.';
    }
    else if (relativePath[0] !== '.') {
        relativePath = './' + relativePath;
    }
    return normalizePath(`${relativePath}/${path.basename(pathTo, ext)}`);
}
async function readPackageJson(rootDir) {
    const pkgJsonPath = path.join(rootDir, 'package.json');
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

const createComponentDefinition = (importTypes, componentModelConfig, includeCustomElement = false) => (cmpMeta) => {
    const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
    const importAs = includeCustomElement ? 'define' + tagNameAsPascal : 'undefined';
    let props = [];
    if (Array.isArray(cmpMeta.properties) && cmpMeta.properties.length > 0) {
        props = cmpMeta.properties.map((prop) => `'${prop.name}'`);
    }
    if (Array.isArray(cmpMeta.events) && cmpMeta.events.length > 0) {
        props = [...props, ...cmpMeta.events.map((event) => `'${event.name}'`)];
    }
    const componentType = `${importTypes}.${tagNameAsPascal}`;
    const findModel = componentModelConfig && componentModelConfig.find((config) => config.elements.includes(cmpMeta.tagName));
    const modelType = findModel !== undefined ? `, ${componentType}["${findModel.targetAttr}"]` : '';
    let templateString = `
export const ${tagNameAsPascal} = /*@__PURE__*/ defineContainer<${componentType}${modelType}>('${cmpMeta.tagName}', ${importAs}`;
    if (props.length > 0) {
        templateString += `, [
  ${props.length > 0 ? props.join(',\n  ') : ''}
]`;
        /**
         * If there are no props,
         * but v-model is still used,
         * make sure we pass in an empty array
         * otherwise all of the defineContainer properties
         * will be off by one space.
         * Note: If you are using v-model then
         * the props array should never be empty
         * as there must be a prop for v-model to update,
         * but this check is there so builds do not crash.
         */
    }
    else if (findModel) {
        templateString += `, []`;
    }
    if (findModel) {
        const targetProp = findModel.targetAttr;
        /**
         * If developer is trying to bind v-model support to a component's
         * prop, but that prop was not defined, warn them of this otherwise
         * v-model will not work as expected.
         */
        if (!props.includes(`'${targetProp}'`)) {
            console.warn(`Your '${cmpMeta.tagName}' component is configured to have v-model support bound to '${targetProp}', but '${targetProp}' is not defined as a property on the component. v-model integration may not work as expected.`);
        }
        templateString += `,\n`;
        templateString += `'${targetProp}', '${findModel.event}'`;
    }
    templateString += `);\n`;
    return templateString;
};

async function vueProxyOutput(config, compilerCtx, outputTarget, components) {
    const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components);
    const rootDir = config.rootDir;
    const pkgData = await readPackageJson(rootDir);
    const finalText = generateProxies(config, filteredComponents, pkgData, outputTarget, rootDir);
    await compilerCtx.fs.writeFile(outputTarget.proxiesFile, finalText);
    await copyResources(config, outputTarget);
}
function getFilteredComponents(excludeComponents = [], cmps) {
    return sortBy(cmps, (cmp) => cmp.tagName).filter((c) => !excludeComponents.includes(c.tagName) && !c.internal);
}
function generateProxies(config, components, pkgData, outputTarget, rootDir) {
    const distTypesDir = path.dirname(pkgData.types);
    const dtsFilePath = path.join(rootDir, distTypesDir, GENERATED_DTS);
    const componentsTypeFile = relativeImport(outputTarget.proxiesFile, dtsFilePath, '.d.ts');
    const pathToCorePackageLoader = getPathToCorePackageLoader(config, outputTarget);
    const imports = `/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';\n`;
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
            .map(createComponentDefinition(IMPORT_TYPES, outputTarget.componentModels, outputTarget.includeImportCustomElements))
            .join('\n'),
    ];
    return final.join('\n') + '\n';
}
async function copyResources(config, outputTarget) {
    if (!config.sys || !config.sys.copy || !config.sys.glob) {
        throw new Error('stencil is not properly initialized at this step. Notify the developer');
    }
    const srcDirectory = path.join(__dirname, '..', 'vue-component-lib');
    const destDirectory = path.join(path.dirname(outputTarget.proxiesFile), 'vue-component-lib');
    return config.sys.copy([
        {
            src: srcDirectory,
            dest: destDirectory,
            keepDirStructure: false,
            warn: false,
        },
    ], srcDirectory);
}
function getPathToCorePackageLoader(config, outputTarget) {
    var _a;
    const basePkg = outputTarget.componentCorePackage || '';
    const distOutputTarget = (_a = config.outputTargets) === null || _a === void 0 ? void 0 : _a.find((o) => o.type === 'dist');
    const distAbsEsmLoaderPath = (distOutputTarget === null || distOutputTarget === void 0 ? void 0 : distOutputTarget.esmLoaderPath) && path.isAbsolute(distOutputTarget.esmLoaderPath)
        ? distOutputTarget.esmLoaderPath
        : null;
    const distRelEsmLoaderPath = config.rootDir && distAbsEsmLoaderPath ? path.relative(config.rootDir, distAbsEsmLoaderPath) : null;
    const loaderDir = outputTarget.loaderDir || distRelEsmLoaderPath || DEFAULT_LOADER_DIR;
    return normalizePath(path.join(basePkg, loaderDir));
}
const GENERATED_DTS = 'components.d.ts';
const IMPORT_TYPES = 'JSX';
const REGISTER_CUSTOM_ELEMENTS = 'defineCustomElements';
const APPLY_POLYFILLS = 'applyPolyfills';
const DEFAULT_LOADER_DIR = '/dist/loader';

const vueOutputTarget = (outputTarget) => ({
    type: 'custom',
    name: 'vue-library',
    validate(config) {
        return normalizeOutputTarget(config, outputTarget);
    },
    async generator(config, compilerCtx, buildCtx) {
        const timespan = buildCtx.createTimeSpan(`generate vue started`, true);
        await vueProxyOutput(config, compilerCtx, outputTarget, buildCtx.components);
        timespan.finish(`generate vue finished`);
    },
});
function normalizeOutputTarget(config, outputTarget) {
    var _a, _b;
    const results = Object.assign(Object.assign({}, outputTarget), { excludeComponents: outputTarget.excludeComponents || [], componentModels: outputTarget.componentModels || [], includePolyfills: (_a = outputTarget.includePolyfills) !== null && _a !== void 0 ? _a : true, includeDefineCustomElements: (_b = outputTarget.includeDefineCustomElements) !== null && _b !== void 0 ? _b : true });
    if (config.rootDir == null) {
        throw new Error('rootDir is not set and it should be set by stencil itself');
    }
    if (outputTarget.proxiesFile == null) {
        throw new Error('proxiesFile is required');
    }
    if (outputTarget.includeDefineCustomElements && outputTarget.includeImportCustomElements) {
        throw new Error('includeDefineCustomElements cannot be used at the same time as includeImportCustomElements since includeDefineCustomElements is used for lazy loading components. Set `includeDefineCustomElements: false` in your Vue output target config to resolve this.');
    }
    if (outputTarget.includeImportCustomElements && outputTarget.includePolyfills) {
        throw new Error('includePolyfills cannot be used at the same time as includeImportCustomElements. Set `includePolyfills: false` in your Vue output target config to resolve this.');
    }
    if (outputTarget.directivesProxyFile && !path.isAbsolute(outputTarget.directivesProxyFile)) {
        results.proxiesFile = normalizePath(path.join(config.rootDir, outputTarget.proxiesFile));
    }
    return results;
}

export { vueOutputTarget };
