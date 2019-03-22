import typescript from 'rollup-plugin-typescript2'
import commonJS from 'rollup-plugin-commonjs'
import resolveModule from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const plugins = [
  resolveModule({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonJS(),
  typescript({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true
  })
]

const deps = Object.keys(
  Object.assign({}, pkg.dependencies, pkg.peerDependencies)
)

export default [
  /**
   * Node.js Build
   */
  {
    input: 'src/index.ts',
    output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
    plugins,
    external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`))
  },
  /**
   * Browser Builds
   */
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.browser, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins,
    external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`))
  }
]
