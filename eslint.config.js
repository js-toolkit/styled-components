/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...require('@js-toolkit/configs/eslint/react'),
  ...require('@js-toolkit/react-hooks/eslint'),

  {
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
    },
  },
];
