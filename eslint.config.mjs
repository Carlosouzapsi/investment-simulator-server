// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import eslintConfigPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Setup para Compatibilidade ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});
// ---------------------------------

export default [
  // 1. Configuração Global Ignorando Pastas
  {
    ignores: ['node_modules/'],
  },

  // 2. Configuração para o próprio arquivo de configuração do ESLint
  // Diz ao ESLint para tratar este arquivo como um Módulo ES.
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  // 3. Configuração para o código da aplicação (CommonJS)
  {
    files: ['src/**/*.js'], // Aplica apenas aos arquivos dentro de 'src'
    ...compat.extends('airbnb-base')[0], // Pega o primeiro (e único) objeto de config do Airbnb
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'class-methods-use-this': 'off',
    },
  },

  // 4. Configuração Específica para Arquivos de Teste
  {
    files: ['src/tests/**/*.js'],
    ...jest.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
    },
  },

  // 5. Configuração do Prettier (DEVE SER A ÚLTIMA)
  // Desabilita todas as regras de formatação do ESLint que conflitam com o Prettier.
  // Isso garante que o Prettier seja a única fonte da verdade para formatação.
  eslintConfigPrettier,
];
