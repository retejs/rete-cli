import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import stylistic from '@stylistic/eslint-plugin';
import stylisticEslintPluginTs from '@stylistic/eslint-plugin-ts';
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

const namingConventions = [
  {
    selector: 'default',
    format: ['camelCase'],
  }, {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  }, {
    selector: 'function',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  }, {
    selector: 'typeLike',
    format: ['PascalCase'],
  }, {
    selector: 'enumMember',
    format: ['UPPER_CASE'],
  }, {
    selector: 'typeProperty',
    format: ['camelCase', 'PascalCase'],
  }, {
    selector: 'import',
    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
  }
]

export function extendNamingConventions(...list) {
  const selectors = list.map(convention => convention.selector)

  return [
    ...namingConventions.filter(convention => !selectors.includes(convention.selector)),
    ...list
  ]
}

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  stylistic.configs['all-flat'],
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticEslintPluginTs,
    },
    languageOptions: {
      parser: tsParser
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-constant-condition': 'error',
      'no-duplicate-imports': 'warn',
      'no-control-regex': 'warn',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty': 'warn',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-unsafe-negation': 'error',
      'no-sparse-arrays': 'error',
      'no-unreachable': 'error',
      'default-case': 'warn',
      eqeqeq: 'warn',
      'no-caller': 'error',
      'no-else-return': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-fallthrough': 'error',
      'no-implied-eval': 'error',
      'no-labels': 'error',
      'no-loop-func': 'error',
      'no-multi-spaces': 'error',
      'no-new': 'error',
      'no-proto': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-self-compare': 'error',
      'init-declarations': ['error', 'always'],
      'no-undefined': 'error',
      'comma-dangle': ['error', 'never'],
      semi: 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      'object-curly-spacing': ['error', 'always'],

      camelcase: ['error', {
        properties: 'always',
      }],

      'comma-spacing': ['warn', {
        before: false,
        after: true,
      }],

      '@stylistic/indent': ['error', 2],
      'newline-after-var': ['error', 'always'],
      'no-mixed-spaces-and-tabs': 'error',

      'no-multiple-empty-lines': ['warn', {
        max: 1,
      }],

      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],

      // 'space-before-function-paren': ['error', {
      //   anonymous: 'always',
      //   named: 'never',
      // }],

      'keyword-spacing': 'error',
      'max-depth': ['warn', 4],

      'max-len': ['warn', 120, 4, {
        ignoreComments: true,
      }],

      'max-params': ['warn', 7],
      'max-statements': ['warn', 12],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      complexity: ['error', 10],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      '@typescript-eslint/naming-convention': ['error', ...namingConventions],
      'padded-blocks': ['error', 'never'],
      'spaced-comment': ['error', 'always'],
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@stylistic/semi': ['error', 'never'],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
      }],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
      '@stylistic/member-delimiter-style': ['error', {
        "multiline": {
          "delimiter": "none",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "multilineDetection": "brackets"
      }],
      '@stylistic/no-extra-parens': ['error', 'all', { 'ignoreJSX': 'multi-line' }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/no-confusing-arrow': "off",
      '@stylistic/array-element-newline': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { 'allowNumber': true }],
      '@stylistic/lines-around-comment': ['error', { 'beforeBlockComment': false, 'beforeLineComment': false }],
      '@stylistic/lines-between-class-members': 'off',
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/dot-location': ['error', 'property'],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@stylistic/operator-linebreak': ['error', 'before'],
    }
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
    }
  }
)