import { computed, ref } from 'vue'

export function useSpotlight() {
  const root = ref(null)
  const x = ref(0)
  const y = ref(0)
  const active = ref(false)
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function onMove(event) {
    if (reduced || !root.value) return
    const rect = root.value.getBoundingClientRect()
    x.value = event.clientX - rect.left
    y.value = event.clientY - rect.top
    active.value = true
  }

  function onLeave() {
    active.value = false
  }

  const glowStyle = computed(() => ({
    opacity: active.value ? 1 : 0,
    background: `radial-gradient(150px circle at ${x.value}px ${y.value}px, rgba(94,106,210,0.15), transparent 70%)`,
  }))

  return { root, onMove, onLeave, glowStyle }
}
