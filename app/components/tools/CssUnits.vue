<script setup lang="ts">
const rootSize = ref(16)
const rem = ref(1)
const px = ref(16)

const pxFromRem = computed(() => Number((Number(rem.value) * Number(rootSize.value)).toFixed(4)))
const remFromPx = computed(() => (Number(rootSize.value) ? Number((Number(px.value) / Number(rootSize.value)).toFixed(4)) : 0))

const units = [
  ['px', 'CSS pixel, the base unit on screen. Not a physical pixel on high-DPI displays.'],
  ['rem', 'Relative to the root element font size (usually 16px).'],
  ['em', 'Relative to the current element font size; compounds when nested.'],
  ['%', 'Relative to the parent, but what it measures depends on the property.'],
  ['vw', '1% of the viewport width, including the scrollbar in some browsers.'],
  ['vh', '1% of the viewport height; mobile browser chrome can change it.'],
  ['dvh', 'Dynamic viewport height, follows retracting browser UI.'],
  ['svh', 'Small viewport height, the smallest possible visible area.'],
  ['lvh', 'Large viewport height, as if browser UI were hidden.'],
  ['ch', 'Width of the "0" glyph in the current font.'],
  ['ex', 'Approximate x-height of the current font.'],
  ['pt', '1/72 inch, common in print CSS.']
]
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Root font size (px)</span><InputNumber v-model="rootSize" :min="1" :max="100" size="small" /></label>
    </div>
    <div class="tool-grid-2">
      <div class="converter">
        <label><span>rem</span><InputNumber v-model="rem" :min="0" size="small" /></label>
        <span class="equals">=</span>
        <b>{{ pxFromRem }} px</b>
      </div>
      <div class="converter">
        <label><span>px</span><InputNumber v-model="px" :min="0" size="small" /></label>
        <span class="equals">=</span>
        <b>{{ remFromPx }} rem</b>
      </div>
    </div>
    <div class="units">
      <div v-for="unit in units" :key="unit[0]" class="unit">
        <b>{{ unit[0] }}</b>
        <span>{{ unit[1] }}</span>
      </div>
    </div>
    <p class="tool-hint">The rem conversion assumes the root font size above. Browsers and users can override it.</p>
  </div>
</template>

<style scoped>
.converter {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 9px;
}

.converter label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.equals {
  color: var(--p-text-muted-color);
}

.units {
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  overflow: hidden;
}

.unit {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 0.8rem;
  padding: 0.45rem 0.7rem;
  font-size: 0.82rem;
}

.unit + .unit {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.unit b {
  font-family: var(--font-code, ui-monospace, monospace);
}

.unit span {
  color: var(--p-text-muted-color);
}
</style>
