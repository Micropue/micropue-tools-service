<script setup lang="ts">
const width = ref(0)
const height = ref(0)
const visualWidth = ref(0)
const visualHeight = ref(0)
const ratio = ref(1)

function update() {
  width.value = window.innerWidth
  height.value = window.innerHeight
  visualWidth.value = window.visualViewport?.width ?? window.innerWidth
  visualHeight.value = window.visualViewport?.height ?? window.innerHeight
  ratio.value = window.devicePixelRatio
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
  window.visualViewport?.addEventListener('resize', update)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
  window.visualViewport?.removeEventListener('resize', update)
})
</script>

<template>
  <div class="tool-ui">
    <div class="stat-grid">
      <div class="tool-stat"><b>{{ width }} × {{ height }}</b><span>Layout viewport (px)</span></div>
      <div class="tool-stat"><b>{{ Math.round(visualWidth) }} × {{ Math.round(visualHeight) }}</b><span>Visual viewport</span></div>
      <div class="tool-stat"><b>{{ ratio }}×</b><span>Device pixel ratio</span></div>
    </div>
    <p class="tool-hint">Resize the window or rotate the device; the values update live. Layout and visual viewports differ when the page is zoomed.</p>
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.7rem;
}
</style>
