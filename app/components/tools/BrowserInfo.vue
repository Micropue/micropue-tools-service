<script setup lang="ts">
const rows = ref<{ label: string; value: string }[]>([])

onMounted(() => {
  const nav = navigator as any
  rows.value = [
    { label: 'Languages', value: (navigator.languages ?? [navigator.language]).join(', ') },
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { label: 'Locale', value: Intl.DateTimeFormat().resolvedOptions().locale },
    { label: 'Screen', value: `${screen.width} × ${screen.height}` },
    { label: 'Viewport', value: `${window.innerWidth} × ${window.innerHeight}` },
    { label: 'Pixel ratio', value: String(window.devicePixelRatio) },
    { label: 'CPU cores', value: nav.hardwareConcurrency ? String(nav.hardwareConcurrency) : 'Not exposed' },
    { label: 'Device memory', value: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Not exposed' },
    { label: 'Touch points', value: String(nav.maxTouchPoints ?? 0) },
    { label: 'Cookies enabled', value: nav.cookieEnabled ? 'Yes' : 'No' },
    { label: 'Online', value: navigator.onLine ? 'Yes' : 'No' },
    { label: 'Color scheme', value: matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light' }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-stat-grid">
      <div v-for="item in rows" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <p class="tool-hint">Only values the browser exposes are shown. Memory and CPU counts are rounded or withheld by some browsers.</p>
  </div>
</template>
