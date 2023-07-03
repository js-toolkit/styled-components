import type { JssOptions } from 'jss';
import ruleValueFunction from 'jss-plugin-rule-value-function';
import ruleValueObservable from 'jss-plugin-rule-value-observable';
import template from 'jss-plugin-template';
import global from 'jss-plugin-global';
import extend from 'jss-plugin-extend';
import nested from 'jss-plugin-nested';
import compose from 'jss-plugin-compose';
import camelCase from 'jss-plugin-camel-case';
import defaultUnit from 'jss-plugin-default-unit';
import expand from 'jss-plugin-expand';
import vendorPrefixer from 'jss-plugin-vendor-prefixer';
import propsSort from 'jss-plugin-props-sort';

interface PluginsFactory {
  ruleValueFunction: typeof ruleValueFunction;
  ruleValueObservable: typeof ruleValueObservable;
  template: typeof template;
  global: typeof global;
  extend: typeof extend;
  nested: typeof nested;
  compose: typeof compose;
  camelCase: typeof camelCase;
  defaultUnit: typeof defaultUnit;
  expand: typeof expand;
  vendorPrefixer: typeof vendorPrefixer;
  propsSort: typeof propsSort;
}

export function getPluginsFactory(): PluginsFactory {
  return {
    ruleValueFunction: () => ruleValueFunction(),
    ruleValueObservable: (options) => ruleValueObservable(options),
    template: () => template(),
    global: () => global(),
    extend: () => extend(),
    nested: () => nested(),
    compose: () => compose(),
    camelCase: () => camelCase(),
    defaultUnit: (options) => defaultUnit(options),
    expand: () => expand(),
    vendorPrefixer: () => vendorPrefixer(),
    propsSort: () => propsSort(),
  };
}

export function getSortOrder(): Record<keyof PluginsFactory, number> {
  return {
    ruleValueFunction: 1,
    ruleValueObservable: 2,
    template: 3,
    global: 4,
    extend: 5,
    nested: 6,
    compose: 7,
    camelCase: 8,
    defaultUnit: 9,
    expand: 10,
    vendorPrefixer: 11,
    propsSort: 12,
  };
}

export function getDefaultPlugins(): Partial<Record<keyof PluginsFactory, true>> {
  return {
    ruleValueFunction: true,
    global: true,
    nested: true,
    camelCase: true,
    defaultUnit: true,
    vendorPrefixer: true,
    propsSort: true,
  };
}

export type CreatePluginsOptions = {
  [P in keyof PluginsFactory]?: boolean | Parameters<PluginsFactory[P]>[0] | undefined;
};

export default function createPlugins(options: CreatePluginsOptions = {}): JssOptions['plugins'] {
  const pluginsFactory = getPluginsFactory();
  const sortOrderMap = getSortOrder();

  return Object.entries({ ...getDefaultPlugins(), ...options })
    .filter(([, enabled]) => !!enabled)
    .sort(([a], [b]) => {
      return sortOrderMap[a as keyof PluginsFactory] - sortOrderMap[b as keyof PluginsFactory];
    })
    .map(([plugin, pluginOpts]) => {
      const factory = pluginsFactory[plugin as keyof PluginsFactory];
      if (typeof pluginOpts === 'boolean') return factory();
      return (factory as (opts: unknown) => JssOptions['plugins'][number])(pluginOpts);
    });
}
