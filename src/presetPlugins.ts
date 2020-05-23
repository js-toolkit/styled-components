import type { JssOptions, Plugin } from 'jss';
// import ruleValueFunction from 'jss-plugin-rule-value-function';
// import ruleValueObservable from 'jss-plugin-rule-value-observable';
// import template from 'jss-plugin-template';
// import global from 'jss-plugin-global';
// import extend from 'jss-plugin-extend';
// import nested from 'jss-plugin-nested';
// import compose from 'jss-plugin-compose';
// import camelCase from 'jss-plugin-camel-case';
// import defaultUnit from 'jss-plugin-default-unit';
// import expand from 'jss-plugin-expand';
// import vendorPrefixer from 'jss-plugin-vendor-prefixer';
// import propsSort from 'jss-plugin-props-sort';

type PluginCreator = () => Plugin;

export const Plugins = {
  /* eslint-disable global-require, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
  ruleValueFunction: (): PluginCreator => require('jss-plugin-rule-value-function').default(),
  ruleValueObservable: (): PluginCreator => require('jss-plugin-rule-value-observable').default(),
  template: (): PluginCreator => require('jss-plugin-template').default(),
  global: (): PluginCreator => require('jss-plugin-global').default(),
  extend: (): PluginCreator => require('jss-plugin-extend').default(),
  nested: (): PluginCreator => require('jss-plugin-nested').default(),
  compose: (): PluginCreator => require('jss-plugin-compose').default(),
  camelCase: (): PluginCreator => require('jss-plugin-camel-case').default(),
  defaultUnit: (): PluginCreator => require('jss-plugin-default-unit').default(),
  expand: (): PluginCreator => require('jss-plugin-expand').default(),
  vendorPrefixer: (): PluginCreator => require('jss-plugin-vendor-prefixer').default(),
  propsSort: (): PluginCreator => require('jss-plugin-props-sort').default(),
  /* eslint-enable */
};

export function getSortOrder(): Record<keyof typeof Plugins, number> {
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

export type PresetOptions = Partial<Record<keyof typeof Plugins, boolean>>;

export const defaultPlugins: Partial<Record<keyof typeof Plugins, true>> = {
  ruleValueFunction: true,
  global: true,
  nested: true,
  camelCase: true,
  defaultUnit: true,
  vendorPrefixer: true,
  propsSort: true,
};

export default function presetPlugins(options: PresetOptions = {}): JssOptions['plugins'] {
  const plugins = Object.entries({ ...defaultPlugins, ...options })
    .filter(([, enabled]) => enabled)
    .map(([plugin]) => plugin);

  const sortOrderMap = getSortOrder();

  return plugins
    .sort((a, b) => sortOrderMap[a] - sortOrderMap[b])
    .map((plugin) => (Plugins[plugin] as PluginCreator)());
}
