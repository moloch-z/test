import type { OutputOptions, RollupBuild } from 'rollup'
import glob from 'fast-glob'
import { parallel } from 'gulp'
import { rollup } from 'rollup'
import url from '@rollup/plugin-url'
import vue from '@vitejs/plugin-vue'
import json from '@rollup/plugin-json'
import { resolve, basename } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import commonjs from '@rollup/plugin-commonjs'
import { camelCase, upperFirst } from 'lodash-es'
import VueMacros from 'unplugin-vue-macros/rollup'
import { generateExternal, withTaskName } from './utils'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { version } from '@umi-meta/umi-meta-ui/package.json'
import { umiMetaUiOutputRoot, localeRoot, umiMetaUiRoot } from './paths'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { target, PKG_BRAND_NAME, PKG_CAMELCASE_LOCAL_NAME, PKG_CAMELCASE_NAME } from './constants'
import { UmiMetaAlias } from './plugins/umi-meta-alias'

const fullOutput = resolve(umiMetaUiOutputRoot, 'dist')

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}
export function formatBundleFilename(name: string, minify: boolean, ext: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}

async function buildFullEntry(minify: boolean) {
  const plugins = [
    json(),
    url(),
    UmiMetaAlias(),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true
        }),
        vueJsx: vueJsx()
      }
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts', '.tsx']
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts'
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production')
      },
      treeShaking: true,
      legalComments: 'eof'
    })
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true
      })
    )
  }

  const bundle = await rollup({
    input: resolve(umiMetaUiRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: resolve(fullOutput, formatBundleFilename('index.full', minify, 'js')),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue'
      },
      sourcemap: minify,
      banner
    },
    {
      format: 'esm',
      file: resolve(fullOutput, formatBundleFilename('index.full', minify, 'mjs')),
      sourcemap: minify,
      banner
    }
  ])
}

async function buildFullLocale(minify: boolean) {
  const files = await glob(`**/*.ts`, {
    cwd: resolve(localeRoot, 'lang'),
    absolute: true
  })
  return Promise.all(
    files.map(async file => {
      const filename = basename(file, '.ts')
      const name = upperFirst(camelCase(filename))

      const bundle = await rollup({
        input: file,
        plugins: [
          esbuild({
            minify,
            sourceMap: minify,
            target
          })
        ]
      })
      await writeBundles(bundle, [
        {
          format: 'umd',
          file: resolve(fullOutput, 'locale', formatBundleFilename(filename, minify, 'js')),
          exports: 'default',
          name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
          sourcemap: minify,
          banner
        },
        {
          format: 'esm',
          file: resolve(fullOutput, 'locale', formatBundleFilename(filename, minify, 'mjs')),
          sourcemap: minify,
          banner
        }
      ])
    })
  )
}

export const buildFull = (minify: boolean) => async () => Promise.all([buildFullEntry(minify), buildFullLocale(minify)])

export const buildFullBundle = parallel(withTaskName('buildFullMinified', buildFull(true)), withTaskName('buildFull', buildFull(false)))
