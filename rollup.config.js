import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';
import { defineConfig } from 'rollup';

export default defineConfig([
  // Library build configuration
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
      exports: 'named'
    },
    external: [
      '@fullstackcraftllc/codevideo-virtual-ide',
      '@fullstackcraftllc/codevideo-types',
      'fs',
      'path',
      'url'
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.prod.json',
            declaration: true,
            declarationDir: 'dist',
            sourceMap: true
          }),
      resolve({
        preferBuiltins: true,
        extensions: ['.ts', '.js']
      }),
      commonjs(),
      json(),
      html({
        include: 'src/html/*.html'
      })
    ]
  },
]);