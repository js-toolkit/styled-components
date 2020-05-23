module.exports = {
  root: true,
  extends: require.resolve('@vzh/configs/eslint/ts.react.eslintrc.js'),
  rules: {
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/prop-types': 'off',
  },
};
