const babel = require('rollup-plugin-babel');
const Case = require('case');
const regenerator = require('rollup-plugin-regenerator');
const { uglify } = require('rollup-plugin-uglify');

const banner = pkg => {
    const {
        name,
        version,
        author,
        license
    } = pkg;
    const text = `/*!\n* ${name} v${version} \n* (c) ${new Date().getFullYear()} ${author} License \n* Released under the ${license} license.\n*/`;

    return text;
}

module.exports = ({
    input,
    name,
    plugins = [],
    globals = {},
    babelPlugins = [],
    ...options
}, pkg) => ({
    input,
    output: {
        file: `build/${Case.kebab(name)}.min.js`,
        name,
        format: 'umd',
        sourcemap: true,
        banner: banner(pkg),
        globals
    },
    watch: {
        include: 'src/**',
        chokidar: false
    },
    external: Object.keys(globals),
    plugins: [
        ...plugins,
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                [require('babel-preset-env'), {
                    modules: false
                }],
                require('babel-preset-es2015-rollup')
            ],
            plugins: [
                require('babel-plugin-typecheck').default,
                require('babel-plugin-syntax-flow'),
                require('babel-plugin-transform-flow-strip-types'),
                require('babel-plugin-transform-object-rest-spread'),
                ...babelPlugins
            ]
        }),
        regenerator(),
        uglify({
            output: {
                preamble: banner(pkg)
            }
        })
    ],
    ...options
});