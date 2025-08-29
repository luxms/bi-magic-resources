module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules:  {
    'no-param-reassign': 'off',
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
     'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': true
    }],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'react/no-unused-prop-types': 'warn',
    'react/require-default-props': 'off',
    'react/button-has-type': 'off',
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'testing-library/prefer-screen-queries': 'off',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        multiline: 'last',
      },
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
  },
};
