import { defineConfig } from 'vite';
import riot from 'rollup-plugin-riot';

import { registerPreprocessor } from '@riotjs/compiler';
import * as sass from 'sass';

import path from "path";

registerPreprocessor('css', 'scss', function(code, { options }) {
    //const { file } = options
    //console.log('Compile the scss code in', file)

    return {
        code: sass.compileString(code, {loadPaths: ['./scss']}).css,
        map: null
    }
})

/**
 * Vite configuration: https://vitejs.dev/config/
 */
export default defineConfig({
    root: process.cwd(),
    plugins: [riot()],
    build: {
        minify: 'esbuild', /** https://vitejs.dev/config/build-options.html#build-minify */
        target: 'esnext' /** https://vitejs.dev/config/build-options.html#build-target */
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    }
})