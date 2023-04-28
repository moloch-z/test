import { withInstall } from '@umi-meta/utils'

import ConfigProvider from './src/config-provider'

export const UConfigProvider = withInstall(ConfigProvider)
export default UConfigProvider

export * from './src/config-provider'
export * from './src/config-provider-props'
export * from './src/constants'
export * from './src/hooks/use-global-config'
