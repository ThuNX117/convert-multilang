import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueEslint from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  // Base JS configuration
  js.configs.recommended,
  
  // Vue files configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        // Node.js globals (for build tools)
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly'
      }
    },
    plugins: {
      vue: vueEslint,
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // Vue 3 recommended rules (relaxed)
      'vue/no-unused-vars': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off', // Relaxed self-closing rule
      'vue/max-attributes-per-line': 'off', // Relaxed attribute line rule
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // General rules (relaxed)
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-useless-escape': 'warn',
      'no-self-assign': 'warn'
    }
  },
  
  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    }
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    }
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'dist_electron/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts'
    ]
  }
]
