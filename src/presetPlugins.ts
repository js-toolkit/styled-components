import type { JssOptions, Plugin } from 'jss';

type PluginCreator = () => Plugin;

function getInstalledPlugin(name: string): PluginCreator | undefined {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return require(name).default();
  } catch (ex) {
    console.error((ex as Error).message || ex);
    return undefined;
  }
}

export const Plugins = {
  ruleValueFunction: (): PluginCreator | undefined =>
    getInstalledPlugin('jss-plugin-rule-value-function'),
  ruleValueObservable: (): PluginCreator | undefined =>
    getInstalledPlugin('jss-plugin-rule-value-observable'),
  template: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-template'),
  global: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-global'),
  extend: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-extend'),
  nested: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-nested'),
  compose: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-compose'),
  camelCase: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-camel-case'),
  defaultUnit: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-default-unit'),
  expand: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-expand'),
  vendorPrefixer: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-vendor-prefixer'),
  propsSort: (): PluginCreator | undefined => getInstalledPlugin('jss-plugin-props-sort'),
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
    .map((plugin) => (Plugins[plugin] as PluginCreator)() ?? '');
}
