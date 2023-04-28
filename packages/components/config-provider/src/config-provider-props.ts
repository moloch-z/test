import { buildProps, definePropType } from '@umi-meta/utils'

import type { ExtractPropTypes } from 'vue'
import type { Language } from '@umi-meta/locale'

export type ExperimentalFeatures = {
  // TO BE Defined
}

export const configProviderProps = buildProps({
  /**
   * @description Controlling if the users want a11y features
   */
  a11y: {
    type: Boolean,
    default: true
  },
  /**
   * @description Locale Object
   */
  locale: {
    type: definePropType<Language>(Object)
  },
  /**
   * @description button related configuration, [see the following table](#button-attributes)
   */
  /**
   * @description features at experimental stage to be added, all features are default to be set to false                                                                                | ^[object]
   */
  experimentalFeatures: {
    type: definePropType<ExperimentalFeatures>(Object)
  },
  /**
   * @description Controls if we should handle keyboard navigation
   */
  keyboardNavigation: {
    type: Boolean,
    default: true
  },
  /**
   * @description global Initial zIndex
   */
  zIndex: Number,
  /**
   * @description global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
   */
  namespace: {
    type: String,
    default: 'u'
  }
} as const)
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
