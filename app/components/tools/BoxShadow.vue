<script setup lang="ts">
const { t } = useI18n()
const layers = ref([
  { x: 0, y: 12, blur: 32, spread: -8, color: '#000000', opacity: 0.35, inset: false }
])

function rgba(hex: string, opacity: number) {
  const clean = hex.replace('#', '')
  const value = clean.length === 3 ? clean.split('').map(char => char + char).join('') : clean.padEnd(6, '0')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const css = computed(() =>
  layers.value
    .map(layer => `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${rgba(layer.color, layer.opacity)}`)
    .join(', ')
)
</script>

<template>
  <div class="tool-ui">
    <div class="preview-wrap">
      <div class="preview" :style="{ boxShadow: css }" />
    </div>

    <div v-for="(layer, index) in layers" :key="index" class="layer">
      <div class="tool-row">
        <strong class="tool-label">{{ t('ui.layer', { n: index + 1 }) }}</strong>
        <label><Checkbox v-model="layer.inset" binary /> Inset</label>
        <TButton v-if="layers.length > 1" size="small" severity="secondary" label="Remove" @click="layers.splice(index, 1)" />
      </div>
      <div class="tool-row">
        <label v-for="field in [['x', 'X'], ['y', 'Y'], ['blur', 'Blur'], ['spread', 'Spread']] as const" :key="field[0]">
          <span>{{ field[1] }}</span>
          <InputNumber v-model="layer[field[0]]" :min="-100" :max="200" size="small" />
        </label>
        <input v-model="layer.color" type="color" class="color-input" />
        <label>
          <span>Opacity</span>
          <InputNumber v-model="layer.opacity" :min="0" :max="1" :step="0.05" size="small" />
        </label>
      </div>
    </div>

    <div class="tool-actions">
      <TButton size="small" severity="secondary" label="Add layer" @click="layers.push({ x: 0, y: 4, blur: 8, spread: 0, color: '#000000', opacity: 0.15, inset: false })" />
    </div>

    <p class="tool-label">CSS</p>
    <pre class="tool-output">box-shadow: {{ css }};</pre>
    <div class="tool-actions"><ToolsCopyButton :text="`box-shadow: ${css};`" /></div>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: grid;
  place-items: center;
  min-height: 220px;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.preview {
  width: 150px;
  height: 150px;
  border-radius: 14px;
  background: var(--p-content-background, #fff);
}

.layer {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.7rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 9px;
}

.color-input {
  width: 42px;
  height: 34px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 7px;
  background: transparent;
}
</style>
