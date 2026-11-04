<script setup lang="ts">
const hex = ref('#18181b')

function normalize(value: string) {
  let clean = value.trim().replace(/^#/, '')
  if (clean.length === 3) clean = clean.split('').map(char => char + char).join('')
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null
  return `#${clean.toLowerCase()}`
}

const rgb = computed(() => {
  const value = normalize(hex.value)
  if (!value) return null
  return {
    r: parseInt(value.slice(1, 3), 16),
    g: parseInt(value.slice(3, 5), 16),
    b: parseInt(value.slice(5, 7), 16)
  }
})

const hsl = computed(() => {
  if (!rgb.value) return null
  const r = rgb.value.r / 255
  const g = rgb.value.g / 255
  const b = rgb.value.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
})

const hsv = computed(() => {
  if (!rgb.value) return null
  const r = rgb.value.r / 255
  const g = rgb.value.g / 255
  const b = rgb.value.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round((d / max) * 100), v: Math.round(max * 100) }
})

const values = computed(() => {
  if (!rgb.value || !hsl.value || !hsv.value) return []
  return [
    { label: 'HEX', value: hex.value.toLowerCase() },
    { label: 'RGB', value: `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})` },
    { label: 'RGBA', value: `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, 1)` },
    { label: 'HSL', value: `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.value.h}, ${hsv.value.s}%, ${hsv.value.v}%)` }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <input v-model="hex" type="color" class="color-input" />
      <InputText v-model="hex" size="small" placeholder="#18181b" />
      <span class="swatch" :style="{ background: normalize(hex) ?? 'transparent' }" />
    </div>

    <div class="tool-stat-grid">
      <div v-for="item in values" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="tool-actions">
      <ToolsCopyButton v-for="item in values" :key="item.label" :text="item.value" />
    </div>
  </div>
</template>

<style scoped>
.color-input {
  width: 44px;
  height: 36px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
}
</style>
