import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';


const env = process.env.NODE_ENV || 'development';


const options = {
  format: 'umd',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true, // https://github.com/blesh/symbol-observable/issues/21
      main: true,
      // browser: true,
    }),
    commonjs({
      // exclude: ['node_modules/symbol-observable/**'],
      include: 'node_modules/**',
      // ignoreGlobal: true,
      namedExports: {
        'node_modules/react/react.js': [
          'Children', 'Component', 'PropTypes', 'createElement',
        ],
        'node_modules/react-dom/server.js': [
          'renderToString',
        ],
        'node_modules/react-dates/index.js': [
          'DayPicker',
        ],
      }
    }),
  ],
};

if (env === 'production') {
  options.plugins.push(uglify());
}

export default options;
