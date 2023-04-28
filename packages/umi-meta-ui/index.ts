import installer from './defaults'
export * from '@umi-meta/constants'
export * from '@umi-meta/directives'
export * from '@umi-meta/hooks'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
