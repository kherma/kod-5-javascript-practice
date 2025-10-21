import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, Handlebars: false } },
  },
  {
    rules: {
      'no-unused-vars': ['warn'],
      indent: ['error', 2],
      'linebreak-style': ['off'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'no-console': ['off'],
      'no-prototype-builtins': ['off'],
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
]);
