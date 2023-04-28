<template>
  <span :class="[ns.b()]">{{ props.text }}</span>
</template>
<script lang="ts" setup>
import { useNamespace } from '@umi-meta/hooks'
const ns = useNamespace('yy-yy')
defineOptions({
  name: 'UYyYy'
})

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>
