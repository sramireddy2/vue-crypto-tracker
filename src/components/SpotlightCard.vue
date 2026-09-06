<template>
  <component
    :is="tag"
    ref="root"
    class="surface-card group"
    :class="cardClass"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div
      class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      :style="glowStyle"
    ></div>
    <div class="relative z-10 min-w-0">
      <slot />
    </div>
  </component>
</template>

<script setup>
import { useSpotlight } from '../composables/useSpotlight'

defineProps({
  tag: { type: String, default: 'div' },
  cardClass: { type: String, default: '' },
})

const { root, onMove, onLeave, glowStyle } = useSpotlight()
</script>
