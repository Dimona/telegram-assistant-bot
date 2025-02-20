import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(dirname, '.prettierrc'), 'utf8'));
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/eslint.config.mjs',
      '**/.eslintrc.js',
      '**/webpack.config.js',
      '**/jest-setup.ts',
      '**/node_modules/**',
      '**/dist/**',
    ],
  },
  ...compat.extends('airbnb-typescript/base', 'prettier'),
  {
    plugins: {
      prettier,
      import: _import,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'no-restricted-syntax': ['error', "BinaryExpression[operator='of']"],
      'no-nested-ternary': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      'import/no-cycle': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': false,
          'ts-ignore': false,
          'ts-nocheck': false,
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          packageDir: ['./', './apps/crud', './apps/clinic', './apps/user-kpi'],
        },
      ],
      'no-await-in-loop': 'off',
      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
      'prettier/prettier': ['error', prettierOptions],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@nestjs/**',
              group: 'external',
            },
            {
              pattern: '@smithy/**',
              group: 'external',
            },
            {
              pattern: '@aws-sdk/**',
              group: 'external',
            },
            {
              pattern: '@eslint/**',
              group: 'external',
            },
            {
              pattern: '@**/**',
              group: 'internal',
            },
          ],
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        },
      ],
    },
  },
];
