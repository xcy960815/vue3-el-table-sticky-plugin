import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'temp/**', 'node_modules/**', 'types/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        ResizeObserver: 'readonly',
        CSSStyleDeclaration: 'readonly',
        HTMLElement: 'readonly',
        Element: 'readonly',
        requestAnimationFrame: 'readonly',
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['*.config.{js,cjs,mjs,ts}'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
