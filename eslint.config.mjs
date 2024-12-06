import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import templatePlugin from 'eslint-plugin-template';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
      template: templatePlugin,
    },
    rules: {
      'arrow-spacing': ['error', { before: true, after: true }], // Enforce spacing around arrow functions
      'block-spacing': 'error', // Enforce spacing inside single-line blocks
      'brace-style': ['error', '1tbs', { allowSingleLine: false }], // Enforce consistent brace style
      'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas in multiline
      'curly': ['error', 'all'], // Require curly braces for all control statements
      'eqeqeq': 'error', // Enforce strict equality
      'indent': ['error', 2, { SwitchCase: 1 }], // Enforce 2-space indentation
      'import/no-absolute-path': 'off', // Allow absolute paths in imports
      'key-spacing': ['error', { afterColon: true, beforeColon: false }], // Enforce spacing in object keys
      'keyword-spacing': ['error', { before: true }], // Enforce spacing around keywords
      'max-len': ['error', { code: 120 }], // Limit maximum line length
      'no-console': 'warn', // Warn about console.log usage
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // Allow ++ in for loops
      'no-undef': 'warn', // Warn about undefined variables
      'no-unreachable': 'warn', // Warn about unreachable code
      'no-unused-vars': 'warn', // Warn about unused variables
      'object-curly-spacing': ['error', 'always'], // Enforce spacing in object literals
      'prettier/prettier': ['error'], // Enforce Prettier formatting
      'quotes': ['error', 'single'], // Enforce single quotes
      'semi': ['error', 'always'], // Require semicolons
      'space-before-blocks': ['error', 'always'], // Enforce spacing before blocks
      // 'template/no-duplicate-attributes': 'error', // Förhindra duplicerade attribut i HTML
      // 'template/html-self-closing': 'warn', // Varning om taggar inte är självstängande där det är relevant (t.ex. <img>)
      // 'template/no-invalid-html': 'error', // Förhindra ogiltig HTML-struktur
    },
  },
  pluginJs.configs.recommended, // Recommended ESLint rules
  prettierConfig, // Disable ESLint rules conflicting with Prettier
];
