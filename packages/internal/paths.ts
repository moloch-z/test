import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..')
export const workspace = resolve(projRoot, 'packages')
export const umiMetaUiRoot = resolve(workspace, 'umi-meta-ui')
export const localeRoot = resolve(workspace, 'locale')
export const umiMetaUiOutputRoot = resolve(umiMetaUiRoot, 'dist')
export const umiMetaUiPackageJson = resolve(umiMetaUiRoot, 'package.json')
