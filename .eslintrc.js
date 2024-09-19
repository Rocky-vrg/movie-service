module.exports = {
  extends: [
    'airbnb', // Airbnb's base JS style guide (without React)
    'airbnb/hooks',
    // "plugin:@typescript-eslint/recommended",
    // "plugin:jest/recommended",// Jest plugin recommended configuration
    'prettier', // Disables ESLint rules that conflict with Prettier
    // "prettier/react",
    // "prettier/@typescript-eslint",
    'plugin:prettier/recommended', // Disables ESLint rules that conflict with Prettier
  ],
  // plugins:[/* "react","@typescript-eslint", *//* "jest" */],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    // project: './tsconfig.json'
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id'],
        allowAfterThis: true,
        allowAfterSuper: true,
      },
    ],
    'consistent-return': 'off',
  },
  ignorePatterns: ['node_modules/', 'build/', 'dist/', 'package-lock.json'],
};
