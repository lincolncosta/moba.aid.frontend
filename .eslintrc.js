module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: ['airbnb', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'eslint-plugin-import-helpers', 'prettier'],
  ignorePatterns: [
    '**/node_modules/**/*',
    '**/dist/**/*',
    '**/build/**/*',
    '**/*.test.js',
    '**/*.stories.js',
    '/_templates',
    '/.now',
    '/.storybook',
    '/scripts',
    '/tools',
    '/apps/**/scripts',
    '/apps/**/src/api',
    '/apps/**/src/dev-tools',
    '/apps/medplus-e2e',
    '/apps/educacional-e2e'
  ],
  rules: {
    'no-delete-var': 'off',
    'prettier/prettier': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-find-dom-node': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/default-props-match-prop-types': 'off',
    'no-underscore-dangle': 'off',
    'no-template-curly-in-string': 'off',
    semi: 'off',
    'global-require': 'off',
    'import/prefer-default-export': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          '/^react$/',
          '/prop-types/',
          '/styled-/',
          '/react/',
          '/components/',
          '/pages/',
          '/api/',
          '/assets/',
          'parent',
          'sibling',
          'index'
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true
        }
      }
    ]
  }
}
