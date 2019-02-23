const babel = require('rollup-plugin-babel');
const Case = require('case');
const regenerator = require('rollup-plugin-regenerator');
const { uglify } = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');

const banner = pkg => {
    const {
        name,
        version,
        author,
        license
    } = pkg;
    const text = `/*!\n* ${name} v${version} \n* (c) ${new Date().getFullYear()} ${author} \n* Released under the ${license} license.\n*/`;

    return text;
}

module.exports = ({
    input,
    name,
    plugins = [],
    globals = {},
    babelPlugins = [],
    ...options
}, pkg, { suffix, format, minify = false, polyfill = false }) => ({
    input,
    output: {
        file: `build/${Case.kebab(name)}.${suffix}.js`,
        name,
        format,
        sourcemap: true,
        banner: banner(pkg),
        globals,
        exports: 'named'
    },
    watch: {
        include: 'src/**',
        chokidar: false
    },
    external: Object.keys(globals),
    plugins: [
        ...plugins,
        resolve({
            extensions: ['.ts', '.js']
        }),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                require('@babel/preset-env'),
                require('@babel/preset-typescript')
            ],
            plugins: [
                require('@babel/plugin-proposal-class-properties'),
                require('@babel/plugin-proposal-object-rest-spread'),
                ...babelPlugins
            ],
            extensions: ['.ts', '.js']
        }),
        ...minify?[uglify({
            output: {
                preamble: banner(pkg)
            }
        })]:[],
        ...polyfill?[regenerator()]:[]
    ],
    ...options
});