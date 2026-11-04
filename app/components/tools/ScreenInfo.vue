<script setup lang="ts">
const rows = ref<{ label: string; value: string }[]>([])

function update() {
  rows.value = [
    { label: 'Screen', value: `${screen.width} × ${screen.height}` },
    { label: 'Available area', value: `${screen.availWidth} × ${screen.availHeight}` },
    { label: 'Color depth', value: `${screen.colorDepth}-bit` },
    { label: 'Pixel ratio', value: String(window.devicePixelRatio) },
    { label: 'Orientation', value: screen.orientation?.type ?? 'Unknown' },
    { label: 'Fullscreen', value: document.fullscreenElement ? 'Yes' : 'No' }
  ]
}

onMounted(() => {
  update()
  screen.orientation?.addEventListener('change', update)
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => {
  screen.orientation?.removeEventListener('change', update)
  window.removeEventListener('resize', update)
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
    <p class="tool-hint">Screen values describe the display; the browser window can be a different size. See Viewport Info for the page area.</p>
  </div>
</template>
