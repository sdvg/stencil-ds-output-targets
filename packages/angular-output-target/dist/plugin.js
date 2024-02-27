import { OutputTypes, normalizePath } from './utils';
import { angularDirectiveProxyOutput } from './output-angular';
import path from 'path';
export const angularOutputTarget = (outputTarget) => {
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
export function normalizeOutputTarget(config, outputTarget) {
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
