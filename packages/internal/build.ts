import type { RollupOptions, RollupBuild } from 'rollup'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild from 'rollup-plugin-esbuild'
import { target } from './constants'
import commonjs from '@rollup/plugin-commonjs'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { deepMerge } from '@umi-meta/utils'
import { generateExternal } from './utils'
import { UmiMetaAlias } from './plugins/umi-meta-alias'

/**
 * 通用构建函数
 * @param {RollupOptions} rollupOptions rollup 配置
 * @param {boolean} concatArray 合并配置时数组是否合并，不合并则替换
 * @returns
 */
export async function build(rollupOptions: Partial<RollupOptions>, concatArray = true): Promise<RollupBuild> {
  return await rollup(
    deepMerge(
      {
        plugins: [
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
            extensions: ['.tsx', '.json', '.js', '.ts']
          }),
          commonjs(),
          esbuild({
            sourceMap: true,
            minify: true,
            define: {
              'process.env.NODE_ENV': JSON.stringify('production')
            },
            target,
            loaders: {
              '.vue': 'ts'
            },
            treeShaking: true
          })
        ],
        external: await generateExternal({ full: true }),
        treeshake: true
      },
      rollupOptions,
      concatArray
    )
  )
}
