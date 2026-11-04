<script setup lang="ts">
const { t } = useI18n()
const color = ref('#3b82f6')
const copied = ref('')

function rgb() {
  const value = color.value.replace('#', '')
  return `rgb(${Number.parseInt(value.slice(0, 2), 16)}, ${Number.parseInt(value.slice(2, 4), 16)}, ${Number.parseInt(value.slice(4, 6), 16)})`
}

function hsl() {
  const value = color.value.replace('#', '')
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
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function copy(value: string) {
  navigator.clipboard?.writeText(value)
  copied.value = value
}

const values = computed(() => [
  { label: 'HEX', value: color.value.toUpperCase() },
  { label: 'RGB', value: rgb() },
  { label: 'HSL', value: hsl() }
])
</script>

<template>
  <div class="tool-ui">
    <div class="preview" :style="{ background: color }" />
    <div class="tool-row">
      <input v-model="color" type="color" class="color-input" />
      <InputText v-model="color" size="small" style="width: 130px" />
    </div>
    <div class="tool-stat-grid">
      <button v-for="item in values" :key="item.label" type="button" class="tool-stat value" @click="copy(item.value)">
        <b>{{ item.value }}</b>
        <span>{{ item.label }} · click to copy</span>
      </button>
    </div>
    <p class="tool-hint">Native color pickers vary by browser and operating system. The values below are exact for the selected colour.</p>
  </div>
</template>

<style scoped>
.preview {
  height: 180px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

.color-input {
  width: 48px;
  height: 38px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 8px;
  background: transparent;
}

.value {
  text-align: left;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.value:hover {
  border-color: color-mix(in srgb, var(--p-text-color) 30%, transparent);
}
</style>
