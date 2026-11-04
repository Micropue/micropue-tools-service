<script setup lang="ts">
const base = ref('#3b82f6')

function hslToHex(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360
  const sat = Math.min(1, Math.max(0, s))
  const light = Math.min(1, Math.max(0, l))
  const c = (1 - Math.abs(2 * light - 1)) * sat
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = light - c / 2
  const [r, g, b] =
    hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x]
  return `#${[r, g, b].map(value => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('')}`
}

function hexToHsl(hex: string) {
  const clean = hex.replace('#', '')
  const value = clean.length === 3 ? clean.split('').map(char => char + char).join('') : clean
  const r = Number.parseInt(value.slice(0, 2), 16) / 255
  const g = Number.parseInt(value.slice(2, 4), 16) / 255
  const b = Number.parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h *= 60
  }
  return { h, s, l }
}

const groups = computed(() => {
  try {
    const clean = base.value.trim().replace('#', '')
    if (!/^[0-9a-f]{6}$/i.test(clean.length === 3 ? clean.split('').map(char => char + char).join('') : clean)) return []
    const { h, s, l } = hexToHsl(base.value)
    return [
      { label: 'Base', colors: [base.value] },
      { label: 'Complementary', colors: [hslToHex(h + 180, s, l)] },
      { label: 'Analogous', colors: [hslToHex(h - 30, s, l), hslToHex(h + 30, s, l)] },
      { label: 'Triadic', colors: [hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)] },
      { label: 'Shades', colors: [hslToHex(h, s, Math.max(0.1, l - 0.2)), hslToHex(h, s, Math.max(0.05, l - 0.1)), hslToHex(h, s, Math.min(0.9, l + 0.1)), hslToHex(h, s, Math.min(0.95, l + 0.2))] }
    ]
  } catch {
    return []
  }
})

const allColors = computed(() => groups.value.flatMap(group => group.colors).join(', '))
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <input v-model="base" type="color" class="color-input" />
      <InputText v-model="base" size="small" style="width: 120px" />
      <ToolsCopyButton :text="allColors" />
    </div>
    <div v-for="group in groups" :key="group.label" class="group">
      <p class="tool-label">{{ group.label }}</p>
      <div class="swatches">
        <div v-for="color in group.colors" :key="color" class="swatch-wrap">
          <span class="swatch" :style="{ background: color }" />
          <span class="hex">{{ color }}</span>
          <ToolsCopyButton :text="color" />
        </div>
      </div>
    </div>
    <p class="tool-hint">Generated from the base hue with HSL rotation. Perceived contrast still needs checking against your text colours.</p>
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
}

.group + .group {
  margin-top: 0.8rem;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.swatch-wrap {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.5rem 0.3rem 0.3rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 8px;
}

.swatch {
  width: 34px;
  height: 34px;
  border-radius: 6px;
}

.hex {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.78rem;
}
</style>
