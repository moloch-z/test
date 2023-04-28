import { useNamespace } from '@umi-meta/hooks'
const ns = useNamespace('ha-ha')

export default () => {
  return <div class={ns.b()}>haha</div>
}
