module.exports = {
  root: true,
  extends: [
    require.resolve('@jstoolkit/configs/eslint/react'),
    require.resolve('@jstoolkit/react-hooks/eslint'),
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
};
