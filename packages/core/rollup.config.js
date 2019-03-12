import typescript from 'rollup-plugin-typescript2'
import commonJS from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const plugins = [
  typescript({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true
  }),
  resolve(),
  commonJS()
]

const deps = Object.keys(Object.assign({}, pkg.dependencies))

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'umd' }
    // { file: pkg.module, format: 'es' }
  ],
  plugins
  // external: id =>
  //   deps.some(dep => id === dep || id.startsWith(`${dep}/`)).concat()
}
