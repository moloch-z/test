import { DirectiveBinding } from 'vue'
import { isFunction } from '@umi-meta/utils'
export const VResize = {
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    const { value } = binding

    if (isFunction(value)) {
      el.addEventListener('resize', (ev: UIEvent) => {
        value(ev)
      })
    }
  }
}
