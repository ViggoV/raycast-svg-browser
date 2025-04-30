import { defineConfig } from 'eslint/config'
import raycastConfig from '@raycast/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  ...raycastConfig,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      '@raycast/prefer-placeholders': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-warning-comments': 'warn',
      'prettier/prettier': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.raycast/**'],
  },
])
