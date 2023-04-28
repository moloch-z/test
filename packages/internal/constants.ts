import { umiMetaUiOutputRoot } from './paths'
import { resolve } from 'path'
import { name } from '@umi-meta/umi-meta-ui/package.json'

export const target = 'es2018'

export const cssModule = 'theme-chalk'
export const fullModule = 'umi-meta'

export const pluginModules = []

export const PKG_PREFIX = '@umi-meta'
export const PKG_NAME = name
export const PKG_CAMELCASE_NAME = 'UmiMetaUi'
export const PKG_CAMELCASE_LOCAL_NAME = 'UmiMetaUiLocale'
export const PKG_BRAND_NAME = 'Umi Meta Ui'

export const modulesBuildConfig = {
  cjs: {
    format: 'cjs',
    ext: 'js',
    output: resolve(umiMetaUiOutputRoot, 'lib'),
    bundle: {
      path: `${PKG_NAME}/lib`
    }
  },
  esm: {
    format: 'esm',
    ext: 'mjs',
    output: resolve(umiMetaUiOutputRoot, 'es'),
    bundle: {
      path: `${PKG_NAME}/es`
    }
  }
}
