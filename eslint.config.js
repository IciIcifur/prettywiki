import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'UNIQUE',
            'SLOT',

            'EVENTS',
            'LIST_RENDERING',
            'CONDITIONALS',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',

            'CONTENT',
            'DEFINITION',
            'RENDER_MODIFIERS',
            'GLOBAL',

            'ATTR_DYNAMIC',
            'ATTR_STATIC',
          ],
          alphabetical: true,
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
