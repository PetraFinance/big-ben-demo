import options from './rollup.config.shared'

options.dest = 'server-bundle.js'
options.entry = 'server.js'
options.format = 'cjs'

options.external = [
  'buffer',
  'crypto',
  'events',
  'fs',
  'http',
  'path',
  'net',
  'querystring',
  'stream',
  'string',
  'tty',
  'url',
  'util',
]

export default options;
