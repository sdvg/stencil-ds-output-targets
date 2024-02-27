import path from 'path';
import { EOL } from 'os';

const OutputTypes = {
    Component: 'component',
    Scam: 'scam',
    Standalone: 'standalone',
};
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
async function readPackageJson(config, rootDir) {
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
const formatToQuotedList = (list) => list.map((item) => `'${item}'`).join(', ');
/**
 * Creates an import statement for a list of named imports from a module.
 * @param imports The list of named imports.
 * @param module The module to import from.
 *
 * @returns The import statement as a string.
 */
const createImportStatement = (imports, module) => {
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
const isOutputTypeCustomElementsBuild = (outputType) => {
    return outputType === OutputTypes.Standalone || outputType === OutputTypes.Scam;
};
/**
 * Creates the collection of import statements for a component based on the component's events type dependencies.
 * @param componentTagName The tag name of the component (pascal case).
 * @param events The events compiler metadata.
 * @param options The options for generating the import statements (e.g. whether to import from the custom elements directory).
 * @returns The import statements as an array of strings.
 */
const createComponentEventTypeImports = (componentTagName, events, options) => {
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
const createAngularComponentDefinition = (tagName, inputs, outputs, methods, includeImportCustomElements = false, standalone = false) => {
    const tagNameAsPascal = dashToPascalCase(tagName);
    const hasInputs = inputs.length > 0;
    const hasOutputs = outputs.length > 0;
    const hasMethods = methods.length > 0;
    // Formats the input strings into comma separated, single quoted values.
    const formattedInputs = formatToQuotedList(inputs);
    // Formats the output strings into comma separated, single quoted values.
    const formattedOutputs = formatToQuotedList(outputs);
    // Formats the method strings into comma separated, single quoted values.
    const formattedMethods = formatToQuotedList(methods);
    const proxyCmpOptions = [];
    if (includeImportCustomElements) {
        const defineCustomElementFn = `define${tagNameAsPascal}`;
        proxyCmpOptions.push(`\n  defineCustomElementFn: ${defineCustomElementFn}`);
    }
    if (hasInputs) {
        proxyCmpOptions.push(`\n  inputs: [${formattedInputs}]`);
    }
    if (hasMethods) {
        proxyCmpOptions.push(`\n  methods: [${formattedMethods}]`);
    }
    let standaloneOption = '';
    if (standalone && includeImportCustomElements) {
        standaloneOption = `\n  standalone: true`;
    }
    /**
     * Notes on the generated output:
     * - We disable @angular-eslint/no-inputs-metadata-property, so that
     * Angular does not complain about the inputs property. The output target
     * uses the inputs property to define the inputs of the component instead of
     * having to use the @Input decorator (and manually define the type and default value).
     */
    const output = `@ProxyCmp({${proxyCmpOptions.join(',')}\n})
@Component({
  selector: '${tagName}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [${formattedInputs}],${standaloneOption}
})
export class ${tagNameAsPascal} {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;${hasOutputs
        ? `
    proxyOutputs(this, this.el, [${formattedOutputs}]);`
        : ''}
  }
}`;
    return output;
};
/**
 * Sanitizes and formats the component event type.
 * @param componentClassName The class name of the component (e.g. 'MyComponent')
 * @param event The Stencil component event.
 * @returns The sanitized event type as a string.
 */
const formatOutputType = (componentClassName, event) => {
    const prefix = `I${componentClassName}`;
    /**
     * The original attribute contains the original type defined by the devs.
     * This regexp normalizes the reference, by removing linebreaks,
     * replacing consecutive spaces with a single space, and adding a single space after commas.
     */
    return Object.entries(event.complexType.references)
        .filter(([_, refObject]) => refObject.location === 'local' || refObject.location === 'import')
        .reduce((type, [src, dst]) => {
        let renamedType = type;
        if (!type.startsWith(prefix)) {
            if (type.startsWith('{') && type.endsWith('}')) {
                /**
                 * If the type starts with { and ends with }, it is an inline type.
                 * For example, `{ a: string }`.
                 * We don't need to rename these types, so we return the original type.
                 */
                renamedType = type;
            }
            else {
                /**
                 * If the type does not start with { and end with }, it is a reference type.
                 * For example, `MyType`.
                 * We need to rename these types, so we prepend the prefix.
                 */
                renamedType = `I${componentClassName}${type}`;
            }
        }
        return (renamedType
            .replace(new RegExp(`^${src}$`, 'g'), `${dst}`)
            // Capture all instances of the `src` field surrounded by non-word characters on each side and join them.
            .replace(new RegExp(`([^\\w])${src}([^\\w])`, 'g'), (v, p1, p2) => {
            if ((dst === null || dst === void 0 ? void 0 : dst.location) === 'import') {
                /**
                 * Replaces a complex type reference within a generic type.
                 * For example, remapping a type like `EventEmitter<CustomEvent<MyEvent<T>>>` to
                 * `EventEmitter<CustomEvent<IMyComponentMyEvent<IMyComponentT>>>`.
                 */
                return [p1, `I${componentClassName}${v.substring(1, v.length - 1)}`, p2].join('');
            }
            return [p1, dst, p2].join('');
        }));
    }, event.complexType.original
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/,\s*/g, ', '));
};
/**
 * Creates a formatted comment block based on the JS doc comment.
 * @param doc The compiler jsdoc.
 * @returns The formatted comment block as a string.
 */
const createDocComment = (doc) => {
    if (doc.text.trim().length === 0 && doc.tags.length === 0) {
        return '';
    }
    return `/**
   * ${doc.text}${doc.tags.length > 0 ? ' ' : ''}${doc.tags.map((tag) => `@${tag.name} ${tag.text}`)}
   */`;
};
/**
 * Creates the component interface type definition.
 * @param outputType The output type.
 * @param tagNameAsPascal The tag name as PascalCase.
 * @param events The events to generate the interface properties for.
 * @param componentCorePackage The component core package.
 * @param customElementsDir The custom elements directory.
 * @returns The component interface type definition as a string.
 */
const createComponentTypeDefinition = (outputType, tagNameAsPascal, events, componentCorePackage, customElementsDir) => {
    const publicEvents = events.filter((ev) => !ev.internal);
    const eventTypeImports = createComponentEventTypeImports(tagNameAsPascal, publicEvents, {
        componentCorePackage,
        customElementsDir,
        outputType,
    });
    const eventTypes = publicEvents.map((event) => {
        const comment = createDocComment(event.docs);
        let eventName = event.name;
        if (event.name.includes('-')) {
            // If an event name includes a dash, we need to wrap it in quotes.
            // https://github.com/ionic-team/stencil-ds-output-targets/issues/212
            eventName = `'${event.name}'`;
        }
        return `${comment.length > 0 ? `  ${comment}` : ''}
  ${eventName}: EventEmitter<CustomEvent<${formatOutputType(tagNameAsPascal, event)}>>;`;
    });
    const interfaceDeclaration = `export declare interface ${tagNameAsPascal} extends Components.${tagNameAsPascal} {`;
    const typeDefinition = (eventTypeImports.length > 0 ? `${eventTypeImports + '\n\n'}` : '') +
        `${interfaceDeclaration}${eventTypes.length === 0
            ? '}'
            : `
${eventTypes.join('\n')}
}`}`;
    return typeDefinition;
};

function generateAngularDirectivesFile(compilerCtx, components, outputTarget) {
    // Only create the file if it is defined in the stencil configuration
    if (!outputTarget.directivesArrayFile) {
        return Promise.resolve();
    }
    const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile, '.ts');
    const directives = components
        .map((cmpMeta) => dashToPascalCase(cmpMeta.tagName))
        .map((className) => `d.${className}`)
        .join(',\n  ');
    const c = `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
  ${directives}
];
`;
    return compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, c);
}

async function generateValueAccessors(compilerCtx, components, outputTarget, config) {
    if (!Array.isArray(outputTarget.valueAccessorConfigs) || outputTarget.valueAccessorConfigs.length === 0) {
        return;
    }
    const targetDir = path.dirname(outputTarget.directivesProxyFile);
    const normalizedValueAccessors = outputTarget.valueAccessorConfigs.reduce((allAccessors, va) => {
        const elementSelectors = Array.isArray(va.elementSelectors) ? va.elementSelectors : [va.elementSelectors];
        const type = va.type;
        let allElementSelectors = [];
        let allEventTargets = [];
        if (allAccessors.hasOwnProperty(type)) {
            allElementSelectors = allAccessors[type].elementSelectors;
            allEventTargets = allAccessors[type].eventTargets;
        }
        return Object.assign(Object.assign({}, allAccessors), { [type]: {
                elementSelectors: allElementSelectors.concat(elementSelectors),
                eventTargets: allEventTargets.concat([[va.event, va.targetAttr]]),
            } });
    }, {});
    await Promise.all(Object.keys(normalizedValueAccessors).map(async (type) => {
        const valueAccessorType = type; // Object.keys converts to string
        const targetFileName = `${type}-value-accessor.ts`;
        const targetFilePath = path.join(targetDir, targetFileName);
        const srcFilePath = path.join(__dirname, '../resources/control-value-accessors/', targetFileName);
        const srcFileContents = await compilerCtx.fs.readFile(srcFilePath);
        const finalText = createValueAccessor(srcFileContents, normalizedValueAccessors[valueAccessorType]);
        await compilerCtx.fs.writeFile(targetFilePath, finalText);
    }));
    await copyResources(config, ['value-accessor.ts'], targetDir);
}
function createValueAccessor(srcFileContents, valueAccessor) {
    const hostContents = valueAccessor.eventTargets.map((listItem) => VALUE_ACCESSOR_EVENTTARGETS.replace(VALUE_ACCESSOR_EVENT, listItem[0]).replace(VALUE_ACCESSOR_TARGETATTR, listItem[1]));
    return srcFileContents
        .replace(VALUE_ACCESSOR_SELECTORS, valueAccessor.elementSelectors.join(', '))
        .replace(VALUE_ACCESSOR_EVENTTARGETS, hostContents.join(`,${EOL}`));
}
function copyResources(config, resourcesFilesToCopy, directory) {
    if (!config.sys || !config.sys.copy) {
        throw new Error('stencil is not properly intialized at this step. Notify the developer');
    }
    const copyTasks = resourcesFilesToCopy.map((rf) => {
        return {
            src: path.join(__dirname, '../resources/control-value-accessors/', rf),
            dest: path.join(directory, rf),
            keepDirStructure: false,
            warn: false,
        };
    });
    return config.sys.copy(copyTasks, path.join(directory));
}
const VALUE_ACCESSOR_SELECTORS = `<VALUE_ACCESSOR_SELECTORS>`;
const VALUE_ACCESSOR_EVENT = `<VALUE_ACCESSOR_EVENT>`;
const VALUE_ACCESSOR_TARGETATTR = '<VALUE_ACCESSOR_TARGETATTR>';
const VALUE_ACCESSOR_EVENTTARGETS = `    '(<VALUE_ACCESSOR_EVENT>)': 'handleChangeEvent($event.target.<VALUE_ACCESSOR_TARGETATTR>)'`;

/**
 * Creates an Angular module declaration for a component wrapper.
 * @param componentTagName The tag name of the Stencil component.
 * @returns The Angular module declaration as a string.
 */
const generateAngularModuleForComponent = (componentTagName) => {
    const tagNameAsPascal = dashToPascalCase(componentTagName);
    const componentClassName = `${tagNameAsPascal}`;
    const moduleClassName = `${tagNameAsPascal}Module`;
    const moduleDefinition = `@NgModule({
  declarations: [${componentClassName}],
  exports: [${componentClassName}]
})
export class ${moduleClassName} { }`;
    return moduleDefinition;
};

async function angularDirectiveProxyOutput(compilerCtx, outputTarget, components, config) {
    const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, components);
    const rootDir = config.rootDir;
    const pkgData = await readPackageJson(config, rootDir);
    const finalText = generateProxies(filteredComponents, pkgData, outputTarget, config.rootDir);
    await Promise.all([
        compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, finalText),
        copyResources$1(config, outputTarget),
        generateAngularDirectivesFile(compilerCtx, filteredComponents, outputTarget),
        generateValueAccessors(compilerCtx, filteredComponents, outputTarget, config),
    ]);
}
function getFilteredComponents(excludeComponents = [], cmps) {
    return sortBy(cmps, (cmp) => cmp.tagName).filter((c) => !excludeComponents.includes(c.tagName) && !c.internal);
}
async function copyResources$1(config, outputTarget) {
    if (!config.sys || !config.sys.copy || !config.sys.glob) {
        throw new Error('stencil is not properly initialized at this step. Notify the developer');
    }
    const srcDirectory = path.join(__dirname, '..', 'angular-component-lib');
    const destDirectory = path.join(path.dirname(outputTarget.directivesProxyFile), 'angular-component-lib');
    return config.sys.copy([
        {
            src: srcDirectory,
            dest: destDirectory,
            keepDirStructure: false,
            warn: false,
        },
    ], srcDirectory);
}
function generateProxies(components, pkgData, outputTarget, rootDir) {
    const distTypesDir = path.dirname(pkgData.types);
    const dtsFilePath = path.join(rootDir, distTypesDir, GENERATED_DTS);
    const { outputType } = outputTarget;
    const componentsTypeFile = relativeImport(outputTarget.directivesProxyFile, dtsFilePath, '.d.ts');
    const includeSingleComponentAngularModules = outputType === OutputTypes.Scam;
    const isCustomElementsBuild = isOutputTypeCustomElementsBuild(outputType);
    const isStandaloneBuild = outputType === OutputTypes.Standalone;
    const includeOutputImports = components.some((component) => component.events.some((event) => !event.internal));
    /**
     * The collection of named imports from @angular/core.
     */
    const angularCoreImports = ['ChangeDetectionStrategy', 'ChangeDetectorRef', 'Component', 'ElementRef'];
    if (includeOutputImports) {
        angularCoreImports.push('EventEmitter');
    }
    angularCoreImports.push('NgZone');
    /**
     * The collection of named imports from the angular-component-lib/utils.
     */
    const componentLibImports = ['ProxyCmp'];
    if (includeOutputImports) {
        componentLibImports.push('proxyOutputs');
    }
    if (includeSingleComponentAngularModules) {
        angularCoreImports.push('NgModule');
    }
    const imports = `/* tslint:disable */
/* auto-generated angular directive proxies */
${createImportStatement(angularCoreImports, '@angular/core')}

${createImportStatement(componentLibImports, './angular-component-lib/utils')}\n`;
    /**
     * Generate JSX import type from correct location.
     * When using custom elements build, we need to import from
     * either the "components" directory or customElementsDir
     * otherwise we risk bundlers pulling in lazy loaded imports.
     */
    const generateTypeImports = () => {
        let importLocation = outputTarget.componentCorePackage
            ? normalizePath(outputTarget.componentCorePackage)
            : normalizePath(componentsTypeFile);
        importLocation += isCustomElementsBuild ? `/${outputTarget.customElementsDir}` : '';
        return `import ${isCustomElementsBuild ? 'type ' : ''}{ ${IMPORT_TYPES} } from '${importLocation}';\n`;
    };
    const typeImports = generateTypeImports();
    let sourceImports = '';
    /**
     * Build an array of Custom Elements build imports and namespace them
     * so that they do not conflict with the Angular wrapper names. For example,
     * IonButton would be imported as IonButtonCmp so as to not conflict with the
     * IonButton Angular Component that takes in the Web Component as a parameter.
     */
    if (isCustomElementsBuild && outputTarget.componentCorePackage !== undefined) {
        const cmpImports = components.map((component) => {
            const pascalImport = dashToPascalCase(component.tagName);
            return `import { defineCustomElement as define${pascalImport} } from '${normalizePath(outputTarget.componentCorePackage)}/${outputTarget.customElementsDir}/${component.tagName}.js';`;
        });
        sourceImports = cmpImports.join('\n');
    }
    const proxyFileOutput = [];
    const filterInternalProps = (prop) => !prop.internal;
    const mapPropName = (prop) => prop.name;
    const { componentCorePackage, customElementsDir } = outputTarget;
    for (let cmpMeta of components) {
        const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
        const inputs = [];
        if (cmpMeta.properties) {
            inputs.push(...cmpMeta.properties.filter(filterInternalProps).map(mapPropName));
        }
        if (cmpMeta.virtualProperties) {
            inputs.push(...cmpMeta.virtualProperties.map(mapPropName));
        }
        inputs.sort();
        const outputs = [];
        if (cmpMeta.events) {
            outputs.push(...cmpMeta.events.filter(filterInternalProps).map(mapPropName));
        }
        const methods = [];
        if (cmpMeta.methods) {
            methods.push(...cmpMeta.methods.filter(filterInternalProps).map(mapPropName));
        }
        /**
         * For each component, we need to generate:
         * 1. The @Component decorated class
         * 2. Optionally the @NgModule decorated class (if includeSingleComponentAngularModules is true)
         * 3. The component interface (using declaration merging for types).
         */
        const componentDefinition = createAngularComponentDefinition(cmpMeta.tagName, inputs, outputs, methods, isCustomElementsBuild, isStandaloneBuild);
        const moduleDefinition = generateAngularModuleForComponent(cmpMeta.tagName);
        const componentTypeDefinition = createComponentTypeDefinition(outputType, tagNameAsPascal, cmpMeta.events, componentCorePackage, customElementsDir);
        proxyFileOutput.push(componentDefinition, '\n');
        if (includeSingleComponentAngularModules) {
            proxyFileOutput.push(moduleDefinition, '\n');
        }
        proxyFileOutput.push(componentTypeDefinition, '\n');
    }
    const final = [imports, typeImports, sourceImports, ...proxyFileOutput];
    return final.join('\n') + '\n';
}
const GENERATED_DTS = 'components.d.ts';
const IMPORT_TYPES = 'Components';

const angularOutputTarget = (outputTarget) => {
    let validatedOutputTarget;
    return {
        type: 'custom',
        name: 'angular-library',
        validate(config) {
            validatedOutputTarget = normalizeOutputTarget(config, outputTarget);
        },
        async generator(config, compilerCtx, buildCtx) {
            const timespan = buildCtx.createTimeSpan(`generate angular proxies started`, true);
            await angularDirectiveProxyOutput(compilerCtx, validatedOutputTarget, buildCtx.components, config);
            timespan.finish(`generate angular proxies finished`);
        },
    };
};
function normalizeOutputTarget(config, outputTarget) {
    const results = Object.assign(Object.assign({}, outputTarget), { excludeComponents: outputTarget.excludeComponents || [], valueAccessorConfigs: outputTarget.valueAccessorConfigs || [], customElementsDir: outputTarget.customElementsDir || 'components', outputType: outputTarget.outputType || OutputTypes.Component });
    if (config.rootDir == null) {
        throw new Error('rootDir is not set and it should be set by stencil itself');
    }
    if (outputTarget.directivesProxyFile == null) {
        throw new Error('directivesProxyFile is required. Please set it in the Stencil config.');
    }
    if (outputTarget.directivesProxyFile && !path.isAbsolute(outputTarget.directivesProxyFile)) {
        results.directivesProxyFile = normalizePath(path.join(config.rootDir, outputTarget.directivesProxyFile));
    }
    if (outputTarget.directivesArrayFile && !path.isAbsolute(outputTarget.directivesArrayFile)) {
        results.directivesArrayFile = normalizePath(path.join(config.rootDir, outputTarget.directivesArrayFile));
    }
    if (outputTarget.includeSingleComponentAngularModules !== undefined) {
        throw new Error("The 'includeSingleComponentAngularModules' option has been removed. Please use 'outputType' instead.");
    }
    return results;
}

export { angularOutputTarget };
